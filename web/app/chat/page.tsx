"use client";

import { Suspense } from "react";
import { useRoomsOverview } from "~/api/chat/hooks";
import RoomList from "~/components/chat/RoomList";
import FullScreenCircularProgress from "~/components/common/FullScreenCircularProgress";

export default function Chat() {
  return (
    <Suspense fallback={<FullScreenCircularProgress />}>
      <ChatListContent />
    </Suspense>
  );
}

function ChatListContent() {
  const { state } = useRoomsOverview();
  return state.current === "loading" ? (
    <FullScreenCircularProgress />
  ) : state.current === "error" ? (
    <p className="p-4 decoration-red">
      エラーが発生しました。リロードしてください。
    </p>
  ) : (
    <RoomList roomsData={state.data} />
  );
}
