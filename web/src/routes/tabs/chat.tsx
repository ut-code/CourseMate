import { Box, Typography } from "@mui/material";
import { useRoomsOverview } from "../../api/chat/hooks";
import { DMOverview } from "../../common/types";
import { useState } from "react";
import { RoomWindow } from "../../components/chat/RoomWindow";
import RoomList from "../../components/chat/RoomList";

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
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {activeRoom ? (
        // activeRoomがtrueの場合、画面全体にRoomWindowを表示
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
          }}
        >
          <RoomWindow room={activeRoom} />
        </Box>
      ) : (
        // activeRoomがfalseの場合、通常のRoomListを表示
        <Box>
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
      )}
    </Box>
  );
}
