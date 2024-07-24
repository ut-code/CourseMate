import { useEffect, useState } from "react";
import { User } from "../../../../common/types";
import { Box, Button, Stack } from "@mui/material";

export default function Home() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [displayedUser, setDisplayedUser] = useState<User | null>(null);
  // const currentUserId = useAuthContext()?.id;
  const currentUserId = 1; // TODO: Fix this

  useEffect(() => {
    async function getUsers() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_ENDPOINT}/users/all`,
        );
        const data = await response.json();
        if (!currentUserId) return;
        const otherUsers = data.filter(
          (user: User) => user.id !== currentUserId,
        );
        setUsers(otherUsers);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    getUsers();
  }, [currentUserId]);

  useEffect(() => {
    if (users) {
      const randomIndex = Math.floor(Math.random() * users.length);
      setDisplayedUser(users[randomIndex]);
    }
  }, [users]);

  const handleClickCross = (): void => {
    if (!users || !displayedUser) return;
    const newUsers = users?.filter((user) => user.id !== displayedUser?.id);
    setUsers(newUsers);
  };

  const handleClickCircle = (): void => {
    if (!displayedUser) return;
    try {
      fetch(`${import.meta.env.VITE_API_ENDPOINT}/requests/sendMatchRequest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: currentUserId,
          receiverId: displayedUser.id,
        }),
      });
    } catch (error) {
      console.error("Error liking user:", error);
    }
    if (!users) return;
    const newUsers = users?.filter((user) => user.id !== displayedUser?.id);
    setUsers(newUsers);
  };

  return (
    <Box>
      <p>Name: {displayedUser?.name}</p>
      <p>id: {displayedUser?.id}</p>
      {displayedUser?.pictureUrl && (
        <img
          src={displayedUser?.pictureUrl}
          alt="Profile Picture"
          style={{ width: "300px", height: "300px", objectFit: "cover" }} // 画像のサイズを指定
        />
      )}
      <Stack direction={"row"}>
        <Button onClick={handleClickCross}>X</Button>
        <Button onClick={handleClickCircle}>O</Button>
      </Stack>
    </Box>
  );
}
