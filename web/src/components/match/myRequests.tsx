import { Box } from "@mui/material";
import hooks from "../../api/hooks";
import { List } from "@mui/material";
import React from "react";
import { ProfileModal } from "../human/profileModal";
import { User } from "../../common/types";
import { HumanListItem } from "../human/humanListItem";

export default function MyReq() {
  const { data, loading, error } = hooks.usePendingRequestsFromMe();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const handleOpen = (selectedUser: User) => {
    setModalOpen(true);
    setSelectedUser(selectedUser);
  };
  const handleClose = () => setModalOpen(false);

  return (
    <Box>
      <p>
        {data && data.length > 0
          ? "以下のリクエストを送信しました"
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
      <ProfileModal
        selectedUser={selectedUser}
        open={modalOpen}
        handleClose={handleClose}
      />
    </Box>
  );
}
