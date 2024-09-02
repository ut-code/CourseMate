import { Box, Paper, Typography, TextField, Button } from "@mui/material";
import { DMOverview, DMRoom, SendMessage, UserID } from "../../common/types";
import { MessageInput } from "./MessageInput";
import { useCurrentUserId } from "../../hooks/useCurrentUser";
import { useState, useEffect, useRef } from "react";
import * as chat from "../../api/chat/chat";
import { RoomHeader } from "./RoomHeader";
import MessagePopupDots from "./MessagePopupDots";

type Prop = {
  room: DMOverview;
};

export function RoomWindow({ room }: Prop) {
  const id = useCurrentUserId();
  const [dm, setDM] = useState<DMRoom | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>("");

  const sendDMMessage = async (to: UserID, msg: SendMessage): Promise<void> => {
    await chat.sendDM(to, msg);
    if (room) {
      refreshMessages(room.friendId);
    }
  };

  const refreshMessages = async (friendId: UserID) => {
    const newDM = await chat.getDM(friendId);
    setDM(newDM);
  };

  useEffect(() => {
    if (room) {
      refreshMessages(room.friendId);
    }
  }, [room]);

  const scrollDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollDiv.current) {
      const element = scrollDiv.current;
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [dm]);

  const handleEdit = (messageId: number, currentContent: string) => {
    setEditingMessageId(messageId);
    setEditedContent(currentContent);
  };

  const handleSaveEdit = async () => {
    if (!editingMessageId) return;
    await chat.updateMessage(editingMessageId, { content: editedContent });
    setEditingMessageId(null);
    setEditedContent("");
    if (room) {
      refreshMessages(room.friendId);
    }
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedContent("");
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
            {dm.messages.map((m) => (
              <Box
                key={m.id}
                sx={{
                  display: "flex",
                  justifyContent: m.creator === id ? "flex-end" : "flex-start",
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
                      backgroundColor: m.creator === id ? "#DCF8C6" : "#FFF",
                      boxShadow: 1,
                      border: 1,
                      cursor: m.creator === id ? "pointer" : "default",
                    }}
                  >
                    <Typography sx={{ wordBreak: "break-word" }}>
                      {m.content}
                    </Typography>
                    {m.creator === id && (
                      <MessagePopupDots
                        message={m}
                        reload={() => refreshMessages(room.friendId)}
                        edit={() => handleEdit(m.id, m.content)}
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
