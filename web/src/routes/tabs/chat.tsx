import { Box, Typography } from "@mui/material";
import { useState } from "react";
import { useRoomsOverview } from "../../api/chat/hooks";
import type { DMOverview } from "../../common/types";
import RoomList from "../../components/chat/RoomList";
import { RoomWindow } from "../../components/chat/RoomWindow";
import FullScreenCircularProgress from "../../components/common/FullScreenCircularProgress";

export default function Chat() {
  console.log("Chat: rendering...");
  const { state } = useRoomsOverview();
  const [activeRoom, setActiveRoom] = useState<DMOverview | null>(null);

  return (
    //ここら辺を一気に変える方が良さげ
    <Box>
      {activeRoom ? (
        // activeRoomがtrueの場合、画面全体にRoomWindowを表示
        <Box>
          <RoomWindow room={activeRoom} setActiveRoom={setActiveRoom} />
        </Box>
      ) : (
        // activeRoomがfalseの場合、通常のRoomListを表示
        <Box>
          {state.current === "loading" ? (
            <FullScreenCircularProgress />
          ) : state.current === "error" ? (
            <Typography color="error">Error: {state.error.message}</Typography>
          ) : (
            <RoomList
              roomsData={state.data}
              activeRoom={activeRoom}
              setActiveRoom={setActiveRoom}
            />
          )}
        </Box>
      )}
    </Box>
  );
}
