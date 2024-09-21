import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  Stack,
} from "@mui/material";
import React from "react";
import hooks from "../../api/hooks";
import request from "../../api/request";
import type { User } from "../../common/types";
import UserAvatar from "../avatar/avatar";
import { ProfileModal } from "../avatar/profileModal";

export default function OthersReq() {
  const { data, loading, error, reload } = hooks.usePendingRequestsToMe();
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
          ? "以下のリクエストを受け取りました"
          : "リクエストは受け取っていません。"}
      </p>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <List>
          {data?.map((sendingUser) => (
            <ListItem
              key={sendingUser.id.toString()}
              secondaryAction={
                <Stack direction={"row"}>
                  <Button
                    onClick={() => {
                      request.accept(sendingUser.id).then(() => reload());
                    }}
                  >
                    承認
                  </Button>
                  <Button
                    onClick={() => {
                      if (
                        !window.confirm(
                          "本当にこのマッチリクエストを拒否しますか?",
                        )
                      )
                        return;
                      request.reject(sendingUser.id).then(() => reload());
                    }}
                  >
                    拒否
                  </Button>
                </Stack>
              }
            >
              <ListItemAvatar>
                <Button onClick={() => handleOpen(sendingUser)}>
                  <UserAvatar
                    pictureUrl={sendingUser.pictureUrl}
                    width="50px"
                    height="50px"
                  />
                </Button>
              </ListItemAvatar>
              <p>{sendingUser.name}</p>
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
