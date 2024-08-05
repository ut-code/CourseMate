import { Box, List, Typography } from "@mui/material";
import * as chat from "../../api/chat/chat";
import { useRoomsOverview } from "../../api/chat/hooks";
import { SendMessage, UserID } from "../../common/types";
import { ChatStack } from "../../components/ChatStack";

export default function Chat() {
  const { data, error, loading } = useRoomsOverview();

  const sendDMMessage = async (to: UserID, msg: SendMessage): Promise<void> => {
    await chat.sendDM(to, msg);
  };
  // TODO!
  // function sendSharedRoomMessage(roomId: ShareRoomID, msg: SendMessage): Promise<void> {
  //   TODO!
  // }

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
                return (
                  <ChatStack
                    key={room.friendId}
                    send={sendDMMessage}
                    room={room}
                  />
                );
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
