import { Stack } from "@mui/material";
import { Box, Paper, Typography } from "@mui/material";
import { DMOverview, DMRoom, SendMessage, UserID } from "../../common/types";
import { MessageInput } from "./MessageInput";
import { useCurrentUserId } from "../../hooks/useCurrentUser";
import UserAvatar from "../avatar/avatar";
import { useState, useEffect, useRef } from "react";
import * as chat from "../../api/chat/chat";

type Prop = {
  room: DMOverview;
};

export function MessageWindow(props: Prop) {
  const id = useCurrentUserId();
  const { room } = props;
  const [messages, setMessages] = useState<DMRoom | null>(null);

  const sendDMMessage = async (to: UserID, msg: SendMessage): Promise<void> => {
    await chat.sendDM(to, msg);
    if (room) {
      fetchMessages(room.friendId);
    }
  };

  const fetchMessages = async (friendId: UserID) => {
    const newMessages = await chat.getDM(friendId);
    setMessages(newMessages);
  };

  useEffect(() => {
    if (room) {
      fetchMessages(room.friendId);
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
  }, [messages]);

  return (
    <>
      <Stack
        sx={{ display: "flex", paddingLeft: 4, paddingTop: 2 }}
        spacing={2}
        direction={"row"}
        alignItems="center"
        textAlign={"center"}
      >
        <UserAvatar
          pictureUrl={room.thumbnail}
          altText={room.name}
          width="40px"
          height="40px"
        />
        <Typography variant="h6">{room.name}</Typography>
      </Stack>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "90%",
          padding: 2,
        }}
      >
        {messages ? (
          <Box
            sx={{ flexGrow: 1, overflowY: "auto", padding: 1 }}
            ref={scrollDiv}
          >
            {messages.messages.map((m) => (
              <Box
                key={m.id}
                sx={{
                  display: "flex",
                  justifyContent: m.creator === id ? "flex-end" : "flex-start",
                  marginBottom: 1,
                }}
              >
                <Paper
                  sx={{
                    display: "flex",
                    maxWidth: "60%",
                    padding: 1,
                    borderRadius: 2,
                    backgroundColor: m.creator === id ? "#DCF8C6" : "#FFF",
                    boxShadow: 1,
                    border: 1,
                  }}
                >
                  <Typography>{m.content}</Typography>
                </Paper>
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
