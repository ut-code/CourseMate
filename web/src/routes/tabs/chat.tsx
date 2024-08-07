import { Box, List, Typography } from "@mui/material";
import * as chat from "../../api/chat/chat";
import { useRoomsOverview } from "../../api/chat/hooks";
import { SendMessage, UserID, DMOverview, DMRoom } from "../../common/types";
import { DMStack } from "../../components/chat/DMStack";
import { useState, useEffect } from "react";
import { MessageWindow } from "../../components/chat/MessageWindow";

export default function Chat() {
  const { data, error, loading } = useRoomsOverview();
  const [selectedRoom, setSelectedRoom] = useState<DMOverview | null>(null);
  const [messages, setMessages] = useState<DMRoom | null>(null);

  const sendDMMessage = async (to: UserID, msg: SendMessage): Promise<void> => {
    await chat.sendDM(to, msg);
    if (selectedRoom) {
      fetchMessages(selectedRoom.friendId);
    }
  };

  const fetchMessages = async (friendId: UserID) => {
    const newMessages = await chat.getDM(friendId);
    setMessages(newMessages);
  };

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.friendId);

      // Set up interval to fetch messages every 10 seconds
      const intervalId = setInterval(
        () => fetchMessages(selectedRoom.friendId),
        10000,
      );

      // Clear interval on component unmount or room change
      return () => clearInterval(intervalId);
    }
  }, [selectedRoom]);

  const handleRoomClick = (room: DMOverview) => {
    setSelectedRoom(room);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ width: "20%", borderRight: "1px solid #ddd" }}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : error ? (
          <Typography color="error">Error: {error.message}</Typography>
        ) : (
          <List>
            {data?.map((room) => {
              if (room.isDM) {
                return (
                  <Box
                    key={room.friendId}
                    onClick={() => handleRoomClick(room)}
                  >
                    <DMStack room={room} />
                  </Box>
                );
              } else {
                return (
                  <Typography key={room.roomId} variant="body2" sx={{ mb: 1 }}>
                    グループチャット: {room.name}
                  </Typography>
                );
              }
            })}
          </List>
        )}
      </Box>
      <Box
        sx={{ width: "80%", position: "relative", backgroundColor: "white" }}
      >
        {selectedRoom && messages && (
          <MessageWindow
            data={messages}
            send={sendDMMessage}
            room={selectedRoom}
          />
        )}
      </Box>
    </Box>
  );
}
