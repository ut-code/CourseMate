"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useRoomsOverview } from "~/api/chat/hooks";
import RoomList from "~/components/chat/RoomList";
import { RoomWindow } from "~/components/chat/RoomWindow";
import FullScreenCircularProgress from "~/components/common/FullScreenCircularProgress";

export default function Chat() {
  return (
    <Suspense fallback={<FullScreenCircularProgress />}>
      <ChatListContent />
    </Suspense>
  );
}

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
    <p color="error">Error: {state.error.message}</p>
  ) : (
    <RoomList roomsData={state.data} />
  );
}
