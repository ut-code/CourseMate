import { useSearchParams } from "next/navigation";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useRef, useState } from "react";
import * as chat from "~/api/chat/chat";
import { useMessages } from "~/api/chat/hooks";
import * as user from "~/api/user";
import { useMyID } from "~/api/user";
import type {
  DMOverview,
  Message,
  MessageID,
  SendMessage,
  UserID,
} from "~/common/types";
import type { Content } from "~/common/zod/types";
import { getIdToken } from "~/firebase/auth/lib";
import Dots from "../common/Dots";
import { socket } from "../data/socket";
import { MessageInput } from "./MessageInput";
import { RoomHeader } from "./RoomHeader";

export function RoomWindow() {
  // FIXME:  React Router が使えなくなったので、一時的に room の情報を URL に載せることで状態管理
  const searchParams = useSearchParams();
  const roomData = searchParams.get("roomData");
  const room = roomData
    ? (JSON.parse(decodeURIComponent(roomData)) as DMOverview)
    : null;

  if (!room) {
    return (
      <div className="text-center text-gray-600">部屋が見つかりません。</div>
    );
  }

  const {
    state: { data: myId },
  } = useMyID();
  const { state, reload, write } = useMessages(room.friendId);
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
        if (msg.creator === room.friendId) {
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
        if (msg.creator === room.friendId) {
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
        room.friendId,
      );
      updateLocalMessage(editedMessage);
    },
    [updateLocalMessage, room.friendId],
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
      <div className="fixed top-14 z-50 w-full bg-white">
        <RoomHeader room={room} />
      </div>
      <div className="absolute top-14 right-0 bottom-14 left-0 flex flex-col overflow-y-auto">
        {messages && messages.length > 0 ? (
          <div className="flex-grow overflow-y-auto p-2" ref={scrollDiv}>
            {messages.map((m) => (
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
                      <button className="btn btn-outline" onClick={cancelEdit}>
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
                            onClick: () => deleteMessage(m.id, room.friendId),
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
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            最初のメッセージを送ってみましょう！
          </div>
        )}
      </div>
      <div className="fixed bottom-0 w-full bg-white p-0">
        <MessageInput send={sendDMMessage} room={room} />
      </div>
    </>
  );
}
