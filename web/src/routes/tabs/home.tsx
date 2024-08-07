import { useEffect, useState } from "react";
import type { User } from "../../common/types";
import { Box, Button, Stack } from "@mui/material";
import user from "../../api/user";
import request from "../../api/request";
import { useCurrentUserId } from "../../hooks/useCurrentUser";
import UserAvatar from "../../components/avatar/avatar";

export default function Home() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [displayedUser, setDisplayedUser] = useState<User | null>(null);
  const currentUserId = useCurrentUserId();

  useEffect(() => {
    (async () => {
      if (!currentUserId) return;

      const matched = await user.matched();
      const users = await user.except(currentUserId);
      const unmatched = users.filter(
        (user) => !matched.some((matchedUser) => matchedUser.id === user.id),
      );
      setUsers(unmatched);
    })().catch(console.error);
  }, [currentUserId]);

  useEffect(() => {
    if (users) {
      const randomIndex = Math.floor(Math.random() * users.length);
      setDisplayedUser(users[randomIndex]);
    }
  }, [users]);

  const handleClickCross = (): void => {
    if (!users || !displayedUser) return;
    const newUsers = users.filter((user) => user.id !== displayedUser.id);
    setUsers(newUsers);
  };

  const handleClickCircle = (): void => {
    if (!displayedUser) return;
    request.send(displayedUser.id).catch((err: unknown) => {
      console.error("Error liking user:", err);
    });
    if (!users) return;
    const newUsers = users.filter((user) => user.id !== displayedUser.id);
    setUsers(newUsers);
  };

  return (
    <Box>
      <p>Name: {displayedUser?.name}</p>
      <p>id: {displayedUser?.id}</p>
      <UserAvatar
        pictureUrl={displayedUser?.pictureUrl}
        width="300px"
        height="300px"
      />
      <Stack direction={"row"}>
        <Button onClick={handleClickCross}>X</Button>
        <Button onClick={handleClickCircle}>O</Button>
      </Stack>
    </Box>
  );
}
