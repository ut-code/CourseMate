import { createLazyFileRoute } from "@tanstack/react-router";
import { useDMOverview } from "../api/chat/hooks";
import type { DMOverview } from "../common/types";
import { RoomWindow } from "../components/chat/RoomWindow";
import FullScreenCircularProgress from "../components/common/FullScreenCircularProgress";

export const Route = createLazyFileRoute("/chat/$id")({
  component: ChatRoom,
});

function ChatRoom() {
  const params = Route.useParams();
  const id = Number.parseInt(params.id);
  if (!id) throw new Error("Invalid param: `id`");
  const { state } = useDMOverview(id);
  switch (state.current) {
    case "loading":
      return <FullScreenCircularProgress />;
    case "success":
      return (
        <RoomWindow room={state.data as DMOverview /* todo: fix zod infer */} />
      );
    case "error":
      return <p> Something Went Wrong: {state.error.message}</p>;
  }
}
