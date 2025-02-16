"use client";

import { Box, List, Typography } from "@mui/material";
import type { RoomOverview } from "common/types";
import { useState } from "react";
// import { useRouter } from "next/navigation";
import { HumanListItem } from "~/components/human/humanListItem";
import RoomPage from "./RoomPage";

type RoomListProps = {
  roomsData: RoomOverview[] | null;
};

export function RoomList(props: RoomListProps) {
  const { roomsData } = props;
  // const router = useRouter();

  const [friendId, setFriendId] = useState<number | null>(null);

  const openRoom = (room: Extract<RoomOverview, { isDM: true }>) => {
    // TODO: room いらん
    setFriendId(room.friendId);
    // router.push(`/chat/${room.friendId}`);
  };

  return (
    <>
      {!friendId ? (
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
              // if (room.matchingStatus === "matched")
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
      ) : (
        <div className="h-screen w-screen bg-gray-200">
          <button
            type="button"
            onClick={() => {
              setFriendId(null);
            }}
          >
            x
          </button>
          <RoomPage id={friendId} />
        </div>
      )}
    </>
  );
}

export default RoomList;
