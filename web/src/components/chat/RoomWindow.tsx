import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import * as chat from "../../api/chat/chat";
import { useMessages } from "../../api/chat/hooks";
import * as user from "../../api/user";
import { useMyID } from "../../api/user";
import type {
  DMOverview,
  Message,
  MessageID,
  SendMessage,
  UserID,
} from "../../common/types";
import type { Content } from "../../common/zod/types";
import { getIdToken } from "../../firebase/auth/lib";
import Dots from "../common/Dots";
import { socket } from "../data/socket";
import { MessageInput } from "./MessageInput";
import { RoomHeader } from "./RoomHeader";

export function RoomWindow() {
  const { state: locationState } = useLocation();
  const { room } = locationState as { room: DMOverview }; // `room`データを抽出

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
    room.friendId,
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
      <Box
        sx={{
          position: "fixed",
          width: "100%",
          zIndex: 500,
          backgroundColor: "white",
          top: "56px",
        }}
      >
        <RoomHeader room={room} />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          top: "56px",
          bottom: "56px",
          left: 0,
          right: 0,
          overflowY: "auto",
        }}
      >
        {messages && messages.length > 0 ? (
          <Box
            sx={{ flexGrow: 1, overflowY: "auto", padding: 1 }}
            ref={scrollDiv}
          >
            {messages.map((m) => (
              <Box
                key={m.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    m.creator === myId ? "flex-end" : "flex-start",
                  marginBottom: 1,
                }}
              >
                {editingMessageId === m.id ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "60%",
                    }}
                  >
                    <TextField
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      onKeyDown={(e) => {
                        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                          commitEdit(editingMessageId, editedContent);
                        }
                      }}
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={3}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        marginTop: 1,
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={() =>
                          commitEdit(editingMessageId, editedContent)
                        }
                        sx={{ minWidth: 100 }}
                      >
                        保存
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={cancelEdit}
                        sx={{ minWidth: 100 }}
                      >
                        キャンセル
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Paper
                    sx={{
                      display: "flex",
                      maxWidth: "60%",
                      padding: 1,
                      borderRadius: 2,
                      backgroundColor:
                        m.creator === myId ? "secondary.main" : "#FFF",
                      boxShadow: 1,
                      border: 1,
                    }}
                  >
                    <Typography
                      sx={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
                    >
                      {m.content}
                    </Typography>
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
                  </Paper>
                )}
              </Box>
            ))}
          </Box>
        ) : (
          <Typography>最初のメッセージを送ってみましょう！</Typography>
        )}
      </Box>
      <Box
        sx={{
          position: "fixed",
          bottom: "52px",
          width: "100%",
          backgroundColor: "#fff",
          padding: "0px",
        }}
      >
        <MessageInput send={sendDMMessage} room={room} />
      </Box>
    </>
  );
}
