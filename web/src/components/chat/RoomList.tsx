import { Box, List, Typography } from "@mui/material";
import type { RoomOverview } from "common/types";
import { useNavigate } from "react-router-dom";
import { HumanListItem } from "~/components/human/humanListItem";

type RoomListProps = {
  roomsData: RoomOverview[] | null;
};

export function RoomList(props: RoomListProps) {
  const { roomsData } = props;
  const navigate = useNavigate();

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
              onClick={() => {
                // `state`を使って`room`データを渡す
                navigate(`./${room.friendId}`, { state: { room } });
              }}
            >
              <HumanListItem
                key={room.friendId}
                id={room.friendId}
                name={room.name}
                pictureUrl={room.thumbnail}
                rollUpName={true}
                lastMessage={
                  room.lastMsg?.isPicture
                    ? "画像を送信しました"
                    : room.lastMsg?.content
                }
              />
            </Box>
          );
        }
        return (
          <Typography key={room.roomId} variant="body2" sx={{ mb: 1 }}>
            グループチャット: {room.name}
          </Typography>
        );
      })}
    </List>
  );
}

export default RoomList;
