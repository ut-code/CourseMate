import { Box, Button, List, ListItem, ListItemAvatar } from "@mui/material";
import React from "react";
import hooks from "../../api/hooks";
import { deleteMatch } from "../../api/match";
import type { User } from "../../common/types";
import { ProfileModal } from "../avatar/profileModal";
import UserAvatar from "../human/avatar";

export default function Followers() {
  // const currentUserId = useAuthContext()?.id;

  const { data, loading, error, reload } = hooks.useMatchedUsers();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const handleOpen = (selectedUser: User) => {
    setModalOpen(true);
    setSelectedUser(selectedUser);
  };
  const handleClose = () => setModalOpen(false);

  return (
    <Box>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <List>
          {data?.map((matchedUser) => (
            <ListItem
              key={matchedUser.id.toString()}
              secondaryAction={
                <Button
                  onClick={() => {
                    if (!window.confirm("本当にこのマッチングを削除しますか?"))
                      return;
                    deleteMatch(matchedUser.id).then(() => reload());
                  }}
                >
                  削除
                </Button>
              }
            >
              <ListItemAvatar>
                <Button onClick={() => handleOpen(matchedUser)}>
                  <UserAvatar
                    pictureUrl={matchedUser.pictureUrl}
                    width="50px"
                    height="50px"
                  />
                </Button>
              </ListItemAvatar>
              <p>{matchedUser.name}</p>
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
