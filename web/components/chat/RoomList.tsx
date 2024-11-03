"use client";

import { Box, List, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import type { RoomOverview } from "../../common/types";
import { HumanListItem } from "../human/humanListItem";

type RoomListProps = {
  roomsData: RoomOverview[] | null;
};

export function RoomList(props: RoomListProps) {
  const { roomsData } = props;
  const router = useRouter();

  /**
   * FIXME:
   * React Router が使えなくなったので、一時的に room の情報を URL に載せることで状態管理
   */
  const navigateToRoom = (room: Extract<RoomOverview, { isDM: true }>) => {
    router.push(
      `./${room.friendId}?roomData=${encodeURIComponent(JSON.stringify(room))}`,
    );
  };

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
                navigateToRoom(room);
              }}
            >
              <HumanListItem
                key={room.friendId}
                id={room.friendId}
                name={room.name}
                pictureUrl={room.thumbnail}
                rollUpName={true}
                lastMessage={room.lastMsg?.content}
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
