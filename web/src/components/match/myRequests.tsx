import { Box } from "@mui/material";
import hooks from "../../api/hooks";
import UserAvatar from "../avatar/avatar";
import { List, ListItem, ListItemAvatar } from "@mui/material";
import React from "react";
import { ProfileModal } from "../avatar/profileModal";
import { User } from "../../common/types";
import { Button } from "@mui/material";

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
              <ListItem key={receivingUser.id.toString()}>
                <ListItemAvatar>
                  <Button onClick={() => handleOpen(receivingUser)}>
                    <UserAvatar
                      pictureUrl={receivingUser.pictureUrl}
                      width="50px"
                      height="50px"
                    />
                  </Button>
                </ListItemAvatar>
                <p>{receivingUser.name}</p>
              </ListItem>
            ))}
        </List>
      )}
      {selectedUser && (
        <ProfileModal
          selectedUser={selectedUser}
          open={modalOpen}
          handleClose={handleClose}
        />
      )}
    </Box>
  );
}
