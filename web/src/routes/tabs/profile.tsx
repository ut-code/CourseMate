import { Box, Button } from "@mui/material";
import LogOutButton from "../../components/LogOutButton";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { User } from "../../../../common/types";
import EditUserDialog from "../../components/EditUserDialog";
import { useAuthContext } from "../../providers/AuthProvider";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  useEffect(() => {
    const user = getAuth().currentUser;
    if (!user) return;
    fetch(`${import.meta.env.VITE_API_ENDPOINT}/users/${user.uid}`)
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  return (
    <Box>
      {user ? (
        <Box>
          <p>Name: {user.name}</p>
          <p>ID: {user.id}</p>
        </Box>
      ) : (
        <p>ユーザ情報が取得できませんでした。</p>
      )}
      <LogOutButton />
      <Button color="inherit" onClick={handleDialogOpen}>
        プロフィールを編集
      </Button>
      <EditUserDialog
        userId={user ? user.id: 1}
        open={isDialogOpen}
        onClose={handleDialogClose}
      />
    </Box>
  );
}
