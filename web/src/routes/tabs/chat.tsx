import { Box, Typography } from "@mui/material";
import { useRoomsOverview } from "../../api/chat/hooks";
import { DMOverview } from "../../common/types";
import { useState } from "react";
import { MessageWindow } from "../../components/chat/MessageWindow";
import RoomList from "../../components/chat/RoomList";

export default function Chat() {
  const {
    data: roomsData,
    error: roomsError,
    loading: roomsLoading,
  } = useRoomsOverview();
  const [activeRoom, setActiveRoom] = useState<DMOverview | null>(null);

  const handleRoomClick = (room: DMOverview) => {
    setActiveRoom(room);
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "90vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          width: "25%",
          borderRight: "1px solid #ddd",
          overflowY: "auto",
        }}
      >
        {roomsLoading ? (
          <Typography>Loading...</Typography>
        ) : roomsError ? (
          <Typography color="error">Error: {roomsError.message}</Typography>
        ) : (
          <RoomList
            roomsData={roomsData}
            activeRoom={activeRoom}
            handleRoomClick={handleRoomClick}
          />
        )}
      </Box>
      <Box
        sx={{
          width: "75%",
          height: "100%",
          backgroundColor: "white",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }}
      >
        {activeRoom ? (
          <MessageWindow room={activeRoom} />
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              textAlign: "center",
            }}
          >
            チャットを始めよう！
          </div>
        )}
      </Box>
    </Box>
  );
}
