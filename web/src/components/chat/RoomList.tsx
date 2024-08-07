import { Box, List, Typography } from "@mui/material";
import { DMOverview, RoomOverview } from "../../common/types";
import { DMStack } from "../../components/chat/DMStack";

interface RoomListProps {
  roomsData: RoomOverview[] | null;
  activeRoom: DMOverview | null;
  handleRoomClick: (room: DMOverview) => void;
}

const RoomList = ({
  roomsData,
  activeRoom,
  handleRoomClick,
}: RoomListProps) => {
  return (
    <List disablePadding>
      {roomsData?.map((room) => {
        if (room.isDM) {
          return (
            <Box
              key={room.friendId}
              onClick={() => handleRoomClick(room)}
              sx={{
                backgroundColor:
                  activeRoom?.friendId === room.friendId
                    ? "gainsboro"
                    : "white",
              }}
            >
              <DMStack room={room} />
            </Box>
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
  );
};

export default RoomList;
