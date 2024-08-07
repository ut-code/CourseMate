import { Stack, Typography, ListItem, Box } from "@mui/material";
import { DMOverview, DMRoom, SendMessage, UserID } from "../../common/types";
import * as chat from "../../api/chat/chat";
import { MessageWindow } from "./MessageWindow";
import { useEffect, useState } from "react";

type Props = {
  send: (to: UserID, m: SendMessage) => void;
  room: DMOverview;
};

export function DMStack(props: Props) {
  const { room, send } = props;
  const [messages, setMessages] = useState<DMRoom | null>(null);
  const [showMessageWindow, setShowMessageWindow] = useState<boolean>(false);

  useEffect(() => {
    // Fetch messages on mount
    const fetchMessages = async () => {
      const newMessages = await chat.getDM(room.friendId);
      setMessages(newMessages);
    };
    fetchMessages();

    // Set up interval to fetch messages every 10 seconds
    const intervalId = setInterval(fetchMessages, 10000);

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [room.friendId]);

  const handleClick = () => {
    setShowMessageWindow(true);
  };

  // const handleSend = (to: UserID, m: SendMessage) => {
  //   send(to, m);
  //   fetchMessages(); // Fetch messages immediately after sending a new message
  // };

  return (
    <>
      <ListItem
        key={room.friendId}
        onClick={handleClick}
        sx={{
          mb: 1,
          border: "2px solid #1976D2",
          borderRadius: 1,
          padding: 5,
          cursor: "pointer",
        }}
        secondaryAction={
          <Stack
            direction={"row"}
            spacing={2}
            alignItems="center"
            textAlign={"center"}
          >
            <Typography variant="body2">{room.name}</Typography>
          </Stack>
        }
      />
      {showMessageWindow && messages && (
        <Box
          sx={{
            position: "fixed",
            right: 0,
            top: 0,
            width: "50%",
            height: "100%",
            backgroundColor: "white",
            borderLeft: "1px solid #ddd",
            zIndex: 1000,
          }}
        >
          <MessageWindow data={messages} send={send} room={room} />
        </Box>
      )}
    </>
  );
}
