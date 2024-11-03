"use client";

import { Typography } from "@mui/material";
import { useRoomsOverview } from "../../api/chat/hooks";
import RoomList from "../../components/chat/RoomList";
import FullScreenCircularProgress from "../../components/common/FullScreenCircularProgress";
import { NavigateByAuthState } from "../../components/common/NavigateByAuthState";

export default function Chat() {
  const { state } = useRoomsOverview();

  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      {state.current === "loading" ? (
        <FullScreenCircularProgress />
      ) : state.current === "error" ? (
        <Typography color="error">Error: {state.error.message}</Typography>
      ) : (
        <RoomList roomsData={state.data} />
      )}
    </NavigateByAuthState>
  );
}
