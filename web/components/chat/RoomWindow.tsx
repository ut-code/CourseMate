"use client";
import type { Message, MessageID, SendMessage, UserID } from "common/types";
import type { Content, DMOverview, DMRoom } from "common/zod/types";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useRef, useState } from "react";
import * as chat from "~/api/chat/chat";
import { useMessages } from "~/api/chat/hooks";
import { API_ENDPOINT } from "~/api/internal/endpoints";
import request from "~/api/request";
import * as user from "~/api/user";
import { useMyID } from "~/api/user";
import { getIdToken } from "~/firebase/auth/lib";
import Dots from "../common/Dots";
import { socket } from "../data/socket";
import { MessageInput } from "./MessageInput";
import { RoomHeader } from "./RoomHeader";

type Props = { friendId: UserID; room: DMRoom & DMOverview };

export function RoomWindow(props: Props) {
  const { friendId, room } = props;

  if (!room) {
    return (
      <div className="text-center text-gray-600">部屋が見つかりません。</div>
    );
  }

  console.log("rendering");
  useEffect(() => {
    (async () => {
      const lastM = room.messages.at(-1);
      if (lastM) {
        console.log("marking as read: ", room.id, lastM.id);
        await chat.markAsRead(room.id, lastM.id);
      }
    })();
  }, [room]);

  const {
    state: { data: myId },
  } = useMyID();
  const { state, reload, write } = useMessages(friendId);
  const [messages, setMessages] = useState(state.data);

  useEffect(() => {
    setMessages(state.data);
  }, [state.data]);

  const { enqueueSnackbar } = useSnackbar();
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");

  async function sendDMMessage(to: UserID, msg: SendMessage): Promise<void> {
    const message = await chat.sendDM(to, msg);
    appendLocalMessage(message);
  }

  //メッセージの追加
  // TODO: make a better UX with better responsibility (using something like SWR)
  const appendLocalMessage = useCallback(
    (m: Message) => {
      setMessages((curr) => {
        const next = curr ? [...curr, m] : [m];
        write(next);
        return next;
      });
    },
    [write],
  );
  const updateLocalMessage = useCallback((_: Message) => reload(), [reload]);
  const deleteLocalMessage = useCallback((_: MessageID) => reload(), [reload]);

  useEffect(() => {
    async function registerSocket() {
      if (!room) return;
      const idToken = await getIdToken();
      socket.emit("register", idToken);
      socket.on("newMessage", async (msg: Message) => {
        if (msg.creator === friendId) {
          appendLocalMessage(msg);
        } else {
          const creator = await user.get(msg.creator);
          if (creator == null) return;
          enqueueSnackbar(
            `${creator.name}さんからのメッセージ : ${msg.content}`,
            {
              variant: "info",
            },
          );
        }
      });
      socket.on("updateMessage", async (msg: Message) => {
        if (msg.creator === friendId) {
          updateLocalMessage(msg);
        }
      });
      socket.on("deleteMessage", async (msgId: number) => {
        deleteLocalMessage(msgId);
      });
    }
    registerSocket();
    // Clean up
    return () => {
      socket.off("newMessage");
      socket.off("updateMessage");
      socket.off("deleteMessage");
    };
  }, [
    room,
    friendId,
    enqueueSnackbar,
    appendLocalMessage,
    updateLocalMessage,
    deleteLocalMessage,
  ]);

  //画面スクロール
  const scrollDiv = useRef<HTMLDivElement>(null);
  const scrollToBottom = useCallback(() => {
    if (scrollDiv.current) {
      const element = scrollDiv.current;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "instant",
      });
    }
  }, []);
  useEffect(() => {
    messages;
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const startEditing = useCallback(
    (messageId: number, currentContent: string) => {
      setEditingMessageId(messageId);
      setEditedContent(currentContent);
    },
    [],
  );

  const commitEdit = useCallback(
    async (message: MessageID, content: Content) => {
      if (!message || content === "") return;
      setEditingMessageId(null);
      setEditedContent("");
      const editedMessage = await chat.updateMessage(
        message,
        { content },
        friendId,
      );
      updateLocalMessage(editedMessage);
    },
    [updateLocalMessage, friendId],
  );

  const cancelEdit = useCallback(() => {
    setEditingMessageId(null);
    setEditedContent("");
  }, []);

  const deleteMessage = useCallback(
    async (messageId: number, friendId: UserID) => {
      deleteLocalMessage(messageId);
      await chat.deleteMessage(messageId, friendId);
    },
    [deleteLocalMessage],
  );

  return (
    <>
      {room.matchingStatus !== "matched" && (
        <FloatingMessage
          message="この人とはマッチングしていません。"
          friendId={friendId}
          showButtons={room.matchingStatus === "otherRequest"}
        />
      )}

      <div className="fixed top-14 z-50 w-full bg-white">
        <RoomHeader room={room} />
      </div>
      <div className="absolute top-14 right-0 left-0 flex flex-col overflow-y-auto">
        {messages && messages.length > 0 ? (
          <div className="flex-grow overflow-y-auto p-2" ref={scrollDiv}>
            {messages.map((m) =>
              m.isPicture ? (
                <img
                  height="300px"
                  width="300px"
                  style={{
                    maxHeight: "300px",
                    maxWidth: "300px",
                    float: m.creator === myId ? "right" : "left",
                  }}
                  key={m.id}
                  alt=""
                  src={API_ENDPOINT + m.content}
                />
              ) : (
                <div
                  key={m.id}
                  className={`mb-2 flex ${
                    m.creator === myId ? "justify-end" : "justify-start"
                  }`}
                >
                  {editingMessageId === m.id ? (
                    <div className="flex w-3/5 flex-col">
                      <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        onKeyDown={(e) => {
                          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                            commitEdit(editingMessageId, editedContent);
                          }
                        }}
                        className="textarea textarea-bordered h-24 w-full"
                      />
                      <div className="mt-2 flex justify-evenly gap-2">
                        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            commitEdit(editingMessageId, editedContent)
                          }
                        >
                          保存
                        </button>
                        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                        <button
                          className="btn btn-outline"
                          onClick={cancelEdit}
                        >
                          キャンセル
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`rounded-xl p-2 shadow ${
                        m.creator === myId ? "bg-secondary" : "bg-white"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">
                        {m.content}
                      </p>
                      {m.creator === myId && (
                        <Dots
                          actions={[
                            {
                              label: "編集",
                              onClick: () => startEditing(m.id, m.content),
                              alert: false,
                            },
                            {
                              label: "削除",
                              color: "red",
                              onClick: () => deleteMessage(m.id, friendId),
                              alert: true,
                              messages: {
                                buttonMessage: "削除",
                                AlertMessage: "本当に削除しますか？",
                                subAlertMessage: "この操作は取り消せません。",
                                yesMessage: "削除",
                              },
                            },
                          ]}
                        />
                      )}
                    </div>
                  )}
                </div>
              ),
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            最初のメッセージを送ってみましょう！
          </div>
        )}
      </div>
      <div className="fixed bottom-12 w-full bg-white p-0">
        <MessageInput reload={reload} send={sendDMMessage} room={room} />
      </div>
    </>
  );
}

type FloatingMessageProps = {
  message: string;
  friendId: number;
  showButtons: boolean;
};

const FloatingMessage = ({
  message,
  friendId,
  showButtons,
}: FloatingMessageProps) => {
  const router = useRouter();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        pointerEvents: "none", // 背景はクリック可能にする
      }}
    >
      <div
        className="w-11/12 max-w-md rounded-lg bg-white p-6 text-center shadow-lg"
        style={{
          pointerEvents: "auto", // モーダル内はクリック可能にする
        }}
      >
        <p>{message}</p>
        {showButtons && (
          <div className="mt-4 space-x-4">
            {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button
              className="btn btn-success btn-sm"
              onClick={() => {
                request.accept(friendId).then(() => router.push("/chat"));
              }}
            >
              承認
            </button>
            {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button
              className="btn btn-error btn-sm"
              onClick={() => {
                request.reject(friendId).then(() => router.push("/chat"));
              }}
            >
              拒否
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
