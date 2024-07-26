import { Box, Button } from "@mui/material";
import LogOutButton from "../../components/LogOutButton";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { User } from "../../../../common/types";
import EditUserDialog from "../../components/EditUserDialog";
import userapi from "../../api/user";

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
    userapi
      .aboutMe()
      .then((data) => setUser(data))
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  if (user) {
    return (
      <Box>
        <Box>
          <p>Name: {user.name}</p>
          <p>ID: {user.id}</p>
          {user.pictureUrl && (
            <img
              src={user.pictureUrl}
              alt="Profile Picture"
              style={{ width: "300px", height: "300px", objectFit: "cover" }} // 画像のサイズを指定
            />
          )}
        </Box>
        <LogOutButton />
        <Button color="inherit" onClick={handleDialogOpen}>
          プロフィールを編集
        </Button>
        <EditUserDialog
          userId={user.id}
          open={isDialogOpen}
          onClose={handleDialogClose}
        />
      </Box>
    );
  } else {
    return <p>ユーザ情報が取得できませんでした。</p>;
  }
}
