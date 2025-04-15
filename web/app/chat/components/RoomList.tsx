"use client";

import { Box, List, Typography } from "@mui/material";
import type { RoomOverview } from "common/types";
import { useRouter, useSearchParams } from "next/navigation";
import BackgroundText from "~/components/common/BackgroundText";
import { HumanListItem } from "~/components/human/humanListItem";
import RoomPage from "./RoomPage";

type RoomListProps = {
  roomsData: RoomOverview[] | null;
};

export function RoomList(props: RoomListProps) {
  const { roomsData } = props;
  const router = useRouter();
  const searchParams = useSearchParams();
  const friendId = searchParams.get("friendId");

  const openRoom = (room: Extract<RoomOverview, { isDM: true }>) => {
    router.push(`/chat?friendId=${room.friendId}`);
  };

  return (
    <>
      {!friendId ? (
        <>
          {roomsData && roomsData.length === 0 ? (
            <BackgroundText text="まだ誰ともマッチングしていません。リクエストを送りましょう！" />
          ) : (
            <List>
              {roomsData?.map((room) => {
                if (room.isDM) {
                  if (room.matchingStatus === "otherRequest") {
                    return (
                      <Box
                        key={room.friendId}
                        onClick={(e) => {
                          e.stopPropagation();
                          openRoom(room);
                        }}
                      >
                        <HumanListItem
                          key={room.friendId}
                          id={room.friendId}
                          name={room.name}
                          pictureUrl={room.thumbnail}
                          rollUpName={true}
                          lastMessage={room.lastMsg?.content}
                          statusMessage="リクエストを受けました"
                          unreadCount={room.unreadMessages}
                        />
                      </Box>
                    );
                  }
                  if (room.matchingStatus === "myRequest") {
                    return (
                      <Box
                        key={room.friendId}
                        onClick={(e) => {
                          e.stopPropagation();
                          openRoom(room);
                        }}
                      >
                        <HumanListItem
                          key={room.friendId}
                          id={room.friendId}
                          name={room.name}
                          pictureUrl={room.thumbnail}
                          rollUpName={true}
                          lastMessage={room.lastMsg?.content}
                          statusMessage="リクエスト中 メッセージを送りましょう！"
                          unreadCount={room.unreadMessages}
                        />
                      </Box>
                    );
                  }
                  return (
                    <Box
                      key={room.friendId}
                      onClick={() => {
                        openRoom(room);
                      }}
                    >
                      <HumanListItem
                        key={room.friendId}
                        id={room.friendId}
                        name={room.name}
                        pictureUrl={room.thumbnail}
                        rollUpName={true}
                        lastMessage={room.lastMsg?.content}
                        unreadCount={room.unreadMessages}
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
          )}
        </>
      ) : (
        <RoomPage id={Number.parseInt(friendId)} />
      )}
    </>
  );
}

export default RoomList;
