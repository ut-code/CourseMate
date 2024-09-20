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
    >
      {activeRoom ? (
        // activeRoomがtrueの場合、画面全体にRoomWindowを表示
        <Box
        >
          <RoomWindow room={activeRoom} setActiveRoom={setActiveRoom}/>
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
