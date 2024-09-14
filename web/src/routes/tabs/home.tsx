import { useEffect, useState } from "react";
import type { PublicUser } from "../../common/types";
import { Box, Button, Stack } from "@mui/material";
import user from "../../api/user";
import request from "../../api/request";
import { useCurrentUserId } from "../../hooks/useCurrentUser";

import { DraggableCard } from "../../components/DraggableCard";

const getBackgroundColor = (x: number) => {
  const maxVal = 255;
  const normalizedValue = Math.max(-maxVal, Math.min(maxVal, x / 2));

  // xが0に近いと白、正の方向に進むと緑、負の方向に進むと赤
  if (normalizedValue === 0) {
    return `rgb(${maxVal}, ${maxVal}, ${maxVal})`; // 白
  } else if (normalizedValue > 0) {
    const greenValue = Math.floor((normalizedValue / maxVal) * 255);
    return `rgb(${maxVal - greenValue}, ${maxVal}, ${maxVal - greenValue})`; // 緑
  } else {
    const redValue = Math.floor((Math.abs(normalizedValue) / maxVal) * 255);
    return `rgb(${maxVal}, ${maxVal - redValue}, ${maxVal - redValue})`; // 赤
  }
};

export default function Home() {
  const [users, setUsers] = useState<PublicUser[] | null>(null);
  const [skippedUsers, setSkippedUsers] = useState<PublicUser[] | null>(null);
  const [displayedUser, setDisplayedUser] = useState<PublicUser | null>(null);
  const { currentUserId, loading } = useCurrentUserId();
  const [isAllUsersLiked, setIsAllUsersLiked] = useState(false);

  useEffect(() => {
    (async () => {
      if (loading || !currentUserId) return;
      const matched = await user.matched();
      const usersPublic = await user.except(currentUserId);
      // TODO: zod
      const users = usersPublic as PublicUser[];
      const unmatched = users.filter(
        (user) => !matched.some((matchedUser) => matchedUser.id === user.id),
      );
      setUsers(unmatched);
    })().catch(console.error);
  }, [currentUserId, loading]);

  useEffect(() => {
    if (users) {
      const randomIndex = Math.floor(Math.random() * users.length);
      setDisplayedUser(users[randomIndex]);
    }
  }, [users]);

  const handleReject = (): void => {
    if (!users || !displayedUser) return;
    alert("skipped!");
    const newUsers = users.filter((user) => user.id !== displayedUser.id);
    const newSkippedUsers = skippedUsers
      ? [...skippedUsers, displayedUser]
      : [displayedUser];
    setSkippedUsers(newSkippedUsers);
    setUsers(newUsers);
    if (newUsers.length === 0) {
      setUsers(newSkippedUsers);
      setSkippedUsers([]);
    }
  };

  const handleAccept = (): void => {
    if (!displayedUser) return;
    request.send(displayedUser.id).catch((err: unknown) => {
      console.error("Error liking user:", err);
    });
    alert("liked!");
    if (!users) return;
    const newUsers = users.filter((user) => user.id !== displayedUser.id);
    setUsers(newUsers);
    if (newUsers.length === 0) {
      if (skippedUsers) {
        setUsers(skippedUsers);
        setSkippedUsers(null);
      } else {
        setIsAllUsersLiked(true);
      }
    }
  };

  const [dragValue, setDragValue] = useState(0); // x方向の値を保存

  const handleDrag = (dragProgress: number) => {
    setDragValue(dragProgress);
  };

  if (isAllUsersLiked) {
    return <div>全員にいいねを送りました！</div>;
  }

  return (
    <div style={{ backgroundColor: getBackgroundColor(dragValue) }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        height={"100vh"}
      >
        {displayedUser && (
          <DraggableCard
            displayedUser={displayedUser}
            onSwipeLeft={handleReject}
            onSwipeRight={handleAccept}
            onDrag={handleDrag}
          />
        )}
        <Stack direction={"row"}>
          <Button onClick={handleReject}>X</Button>
          <Button onClick={handleAccept}>O</Button>
        </Stack>
      </Box>
    </div>
  );
}
