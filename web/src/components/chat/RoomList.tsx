import { Box, List, Typography } from "@mui/material";
import { DMOverview, RoomOverview } from "../../common/types";
import { HumanListItem } from "../human/humanListItem";

type RoomListProps = {
  roomsData: RoomOverview[] | null;
  activeRoom: DMOverview | null;
  setActiveRoom: (room: DMOverview) => void;
};

export function RoomList(props: RoomListProps) {
  const { roomsData, activeRoom, setActiveRoom } = props;
  return (
    <List disablePadding>
      <p
        style={{
          marginLeft: "40px",
          marginRight: "40px",
        }}
      >
        {roomsData && roomsData.length === 0 && (
          <>
            誰ともマッチングしていません。
            <br />
            リクエストを送りましょう！
          </>
        )}
      </p>
      {roomsData?.map((room) => {
        if (room.isDM) {
          return (
            <Box
              key={room.friendId}
              onClick={() => setActiveRoom(room)}
              sx={{
                backgroundColor:
                  activeRoom?.friendId === room.friendId
                    ? "gainsboro"
                    : "white",
              }}
            >
              <HumanListItem
                key={room.friendId}
                id={room.friendId}
                name={room.name}
                pictureUrl={room.thumbnail}
              />
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
}

export default RoomList;
