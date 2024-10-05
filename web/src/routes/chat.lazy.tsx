import { Typography } from "@mui/material";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useRoomsOverview } from "../api/chat/hooks";
import RoomList from "../components/chat/RoomList";
import FullScreenCircularProgress from "../components/common/FullScreenCircularProgress";

export const Route = createLazyFileRoute("/chat")({
  component: Chat,
});

function Chat() {
  const { state } = useRoomsOverview();

  if (state.current === "loading") {
    return <FullScreenCircularProgress />;
  }

  if (state.current === "error") {
    return <Typography color="error">Error: {state.error.message}</Typography>;
  }

  return <RoomList roomsData={state.data} />;
}
