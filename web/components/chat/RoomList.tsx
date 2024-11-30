"use client";

import { Box, List, Typography } from "@mui/material";
import type { RoomOverview } from "common/types";
import { useRouter } from "next/navigation";
import request from "~/api/request";
import { HumanListItem } from "../human/humanListItem";

type RoomListProps = {
  roomsData: RoomOverview[] | null;
};

export function RoomList(props: RoomListProps) {
  const { roomsData } = props;
  const router = useRouter();
  const navigateToRoom = (room: Extract<RoomOverview, { isDM: true }>) => {
    router.push(`/chat/${room.friendId}`);
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
          if (!room.isFriend) {
            return (
              <Box
                key={room.friendId}
                onClick={(e) => {
                  e.stopPropagation();
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
                  onAccept={() => {
                    request.accept(room.friendId).then(() => location.reload());
                  }}
                  onReject={() => {
                    request.reject(room.friendId).then(() => location.reload());
                  }}
                />
              </Box>
            );
          }
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
