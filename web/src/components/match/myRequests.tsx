import { Box } from "@mui/material";
import hooks from "../../api/hooks";
import { List } from "@mui/material";
import { useState } from "react";
import { User } from "../../common/types";
import { HumanListItem } from "../human/humanListItem";
import { ProfileModal } from "../common/profileModal";

export default function MyReq() {
  const { data, loading, error } = hooks.usePendingRequestsFromMe();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (user: User) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  return (
    <Box>
      <p
        style={{
          marginLeft: "40px",
        }}
      >
        {data && data.length > 0
          ? "以下のリクエストを送信しました！"
          : "リクエストを送信しましょう！"}
      </p>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <List>
          {data !== undefined &&
            data?.map((receivingUser) => (
              <HumanListItem
                key={receivingUser.id}
                id={receivingUser.id}
                name={receivingUser.name}
                pictureUrl={receivingUser.pictureUrl}
                onOpen={() => handleOpen(receivingUser)}
              />
            ))}
        </List>
      )}
      {selectedUser && open && (
        <ProfileModal user={selectedUser} open={open} onClose={handleClose} />
      )}
    </Box>
  );
}
