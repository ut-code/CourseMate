import { Box } from "@mui/material";
import LogOutButton from "../../components/LogOutButton";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { User } from "../../../../common/types";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);

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
          {user.pictureUrl && (
            <img
              src={user.pictureUrl}
              alt="Profile Picture"
              style={{ width: "300px", height: "300px", objectFit: "cover" }} // 画像のサイズを指定
            />
          )}
        </Box>
      ) : (
        <p>ユーザ情報が取得できませんでした。</p>
      )}
      <LogOutButton />
    </Box>
  );
}
