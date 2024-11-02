"use client";

import { Box, List, Typography } from "@mui/material";
import type { RoomOverview } from "../../common/types";
import { HumanListItem } from "../human/humanListItem";
import { useRouter } from "next/navigation";

type RoomListProps = {
  roomsData: RoomOverview[] | null;
};

export function RoomList(props: RoomListProps) {
  const { roomsData } = props;
  const router = useRouter();

  return (
    <List disablePadding>
      <div
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
      </div>
      {roomsData?.map((room) => {
        if (room.isDM) {
          return (
            <Box
              key={room.friendId}
              onClick={() => {
                // `state`を使って`room`データを渡す
                router.push(`./${room.friendId}`);
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
