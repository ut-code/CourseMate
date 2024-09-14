import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { DMOverview, Message, SendMessage, UserID } from "../../common/types";
import { MessageInput } from "./MessageInput";
import { useCurrentUserId } from "../../hooks/useCurrentUser";
import { useState, useEffect, useRef } from "react";
import * as chat from "../../api/chat/chat";
import { RoomHeader } from "./RoomHeader";
import MessagePopupDots from "./MessagePopupDots";
import { socket } from "../data/socket";
import { getIdToken } from "../../firebase/auth/lib";
import { useSnackbar } from "notistack";
import user from "../../api/user";

type Prop = {
  room: DMOverview;
};

export function RoomWindow(props: Prop) {
  const { room } = props;
  const { currentUserId, loading } = useCurrentUserId();
  const [dm, setDM] = useState<Message[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const id = useCurrentUserId();
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");

  async function sendDMMessage(to: UserID, msg: SendMessage): Promise<void> {
    const message = await chat.sendDM(to, msg);
    appendMessage(message);
  }

  //メッセージの追加
  function appendMessage(newMessage: Message) {
    setDM((prevDM) => {
      return [...prevDM, newMessage];
    });
  }
  async function refreshMessages(friendId: UserID) {
    const newDM = await chat.getDM(friendId);
    setDM(newDM.messages);
  }
  function updateMessages(updatedMessage: Message) {
    setDM((prevDM) => {
      return prevDM.map((m) => {
        if (m.id === updatedMessage.id) {
          return updatedMessage;
        }
        return m;
      });
    });
  }

  useEffect(() => {
    async function registerSocket() {
      const idToken = await getIdToken();
      socket.emit("register", idToken);
      socket.on("newMessage", async (msg: Message) => {
        if (msg.creator === room.friendId) {
          appendMessage(msg);
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
          updateMessages(msg);
        }
      });
      socket.on("deleteMessage", async (msgId: number) => {
        setDM((prevDM) => {
          return prevDM.filter((m) => m.id !== msgId);
        });
      });
    }
    if (!loading && currentUserId) {
      registerSocket();
    }
    // Clean up
    return () => {
      socket.off("newMessage");
    };
  }, [loading, currentUserId, room.friendId, enqueueSnackbar]);

  useEffect(() => {
    if (room?.friendId) {
      refreshMessages(room.friendId);
    }
  }, [room.friendId]);

  //画面スクロール
  const scrollDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollDiv.current) {
      const element = scrollDiv.current;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "instant",
      });
    }
  }, [dm]);

  const handleEdit = (messageId: number, currentContent: string) => {
    setEditingMessageId(messageId);
    setEditedContent(currentContent);
  };

  const handleSaveEdit = async () => {
    if (!editingMessageId || editedContent === "") return;
    const editedMessage = await chat.updateMessage(
      editingMessageId,
      { content: editedContent },
      room.friendId,
    );
    setEditingMessageId(null);
    setEditedContent("");
    updateMessages(editedMessage);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedContent("");
  };

  const handleDelete = async (messageId: number, friendId: UserID) => {
    await chat.deleteMessage(messageId, friendId);
    setDM((prevDM) => {
      return prevDM.filter((m) => m.id !== messageId);
    });
  };

  return (
    <>
      <RoomHeader room={room} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "90%",
          padding: 2,
        }}
      >
        {dm ? (
          <Box
            sx={{ flexGrow: 1, overflowY: "auto", padding: 1 }}
            ref={scrollDiv}
          >
            {dm.map((m) => (
              <Box
                key={m.id}
                sx={{
                  display: "flex",
                  justifyContent:
                    m.creator === id.currentUserId ? "flex-end" : "flex-start",
                  marginBottom: 1,
                }}
              >
                {editingMessageId === m.id ? (
                  // 編集モード
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
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={3}
                    />
                    <Box sx={{ display: "flex", gap: 1, marginTop: 1 }}>
                      <Button variant="contained" onClick={handleSaveEdit}>
                        Save
                      </Button>
                      <Button variant="outlined" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  // 通常のメッセージ表示
                  <Paper
                    sx={{
                      display: "flex",
                      maxWidth: "60%",
                      padding: 1,
                      borderRadius: 2,
                      backgroundColor:
                        m.creator === id.currentUserId ? "#DCF8C6" : "#FFF",
                      boxShadow: 1,
                      border: 1,
                      cursor:
                        m.creator === id.currentUserId ? "pointer" : "default",
                    }}
                  >
                    <Typography sx={{ wordBreak: "break-word" }}>
                      {m.content}
                    </Typography>
                    {m.creator === id.currentUserId && (
                      <MessagePopupDots
                        handleEdit={() => handleEdit(m.id, m.content)}
                        handleDelete={() => handleDelete(m.id, room.friendId)}
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

        <MessageInput send={sendDMMessage} room={room} />
      </Box>
    </>
  );
}
