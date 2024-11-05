"use client";

import { Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useRoomsOverview } from "../../api/chat/hooks";
import RoomList from "../../components/chat/RoomList";
import { RoomWindow } from "../../components/chat/RoomWindow";
import FullScreenCircularProgress from "../../components/common/FullScreenCircularProgress";
import { NavigateByAuthState } from "../../components/common/NavigateByAuthState";

function ChatListContent() {
  const searchParams = useSearchParams();

  const friendId = searchParams.get("friendId");

  const { state } = useRoomsOverview();

  return friendId ? (
    <>
      <p>Chat - friend Id: {friendId}</p>
      <RoomWindow />
    </>
  ) : state.current === "loading" ? (
    <FullScreenCircularProgress />
  ) : state.current === "error" ? (
    <Typography color="error">Error: {state.error.message}</Typography>
  ) : (
    <RoomList roomsData={state.data} />
  );
}

export default function Chat() {
  return (
    <NavigateByAuthState type="toLoginForUnauthenticated">
      <Suspense fallback={<FullScreenCircularProgress />}>
        <ChatListContent />
      </Suspense>
    </NavigateByAuthState>
  );
}
