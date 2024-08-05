import { Box, List, Typography } from "@mui/material";
import * as chat from "../../api/chat/chat";
import { useRoomsOverview } from "../../api/chat/hooks";
import { RoomOverview, SendMessage } from "../../common/types";
import { ChatStack } from "../../components/ChatStack";

export default function Chat() {
  const { data, error, loading, reload } = useRoomsOverview();

  const submitMessage = async (room: RoomOverview, msg: SendMessage) => {
    if (room.isDM) {
      await chat.sendDM(room.friendId, msg);
    } else {
      await chat.send(room.roomId, msg);
    }
    reload();
  };

  return (
    <Box>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">Error: {error.message}</Typography>
      ) : (
        <List>
          {data !== undefined &&
            data?.map((room) => {
              if (room.isDM) {
                return <ChatStack send={submitMessage} room={room} />;
              } else {
                return (
                  <Typography key={room.roomId} variant="body2" sx={{ mb: 1 }}>
                    グループチャット: {room.name}
                  </Typography>
                );
              }
            })}
        </List>
      )}
    </Box>
  );
}
