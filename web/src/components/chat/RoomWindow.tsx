import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { DMOverview, Message, SendMessage, UserID } from "../../common/types";
import { MessageInput } from "./MessageInput";
import { useCurrentUserId } from "../../hooks/useCurrentUser";
import { useState, useEffect, useRef } from "react";
import * as chat from "../../api/chat/chat";
import { RoomHeader } from "./RoomHeader";
import { socket } from "../data/socket";
import { getIdToken } from "../../firebase/auth/lib";
import { useSnackbar } from "notistack";
import user from "../../api/user";
import Dots from "../common/Dots";

type Prop = {
  room: DMOverview;
  setActiveRoom: (room: DMOverview | null) => void;
};

export function RoomWindow(props: Prop) {
  const { room, setActiveRoom } = props;
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
            }
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
      room.friendId
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
      <Box
        sx={{
          position: "fixed",
          width: "100%",
          zIndex: 500,
          backgroundColor: "white",
          top: "56px",
        }}
      >
        <RoomHeader room={room} setActiveRoom={setActiveRoom} />
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
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        marginTop: 1,
                        justifyContent: "space-evenly"
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={handleSaveEdit}
                        sx={{ minWidth: 100}} 
                      >
                        保存
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleCancelEdit}
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
                        m.creator === id.currentUserId ? "secondary.main" : "#FFF",
                      boxShadow: 1,
                      border: 1,
                      // cursor:
                      //   m.creator === id.currentUserId ? "pointer" : "default",
                    }}
                  >
                    <Typography sx={{ wordBreak: "break-word" }}>
                      {m.content}
                    </Typography>
                    {m.creator === id.currentUserId && (
                      <Dots
                        actions={[
                          {
                            label: "編集",
                            onClick: () => handleEdit(m.id, m.content),
                            alert: false,
                          },
                          {
                            label: "削除",
                            color: "red",
                            onClick: () => handleDelete(m.id, room.friendId),
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
