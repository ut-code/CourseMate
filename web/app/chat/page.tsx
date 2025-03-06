"use client";

import { useRoomsOverview } from "~/api/chat/hooks";
import FullScreenCircularProgress from "~/components/common/FullScreenCircularProgress";
import RoomList from "./components/RoomList";

export default function Chat() {
  return <ChatListContent />;
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
