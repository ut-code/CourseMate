import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useRoomsOverview } from "../../api/chat/hooks";
import type { DMOverview } from "../../common/types";
import RoomList from "../../components/chat/RoomList";
import { RoomWindow } from "../../components/chat/RoomWindow";

export default function Chat() {
  const {
    data: roomsData,
    error: roomsError,
    loading: roomsLoading,
  } = useRoomsOverview();
  const [activeRoom, setActiveRoom] = useState<DMOverview | null>(null);

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
            setActiveRoom={setActiveRoom}
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
          <RoomWindow room={activeRoom} />
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
