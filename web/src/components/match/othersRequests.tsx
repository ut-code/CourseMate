import {
  Box,
  List,
  ListItem,
  Button,
  Stack,
  ListItemAvatar,
} from "@mui/material";
import request from "../../api/request";
import hooks from "../../api/hooks";
import UserAvatar from "../avatar/avatar";
import React from "react";
import { ProfileModal } from "../avatar/profileModal";
import { User } from "../../common/types";

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
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <List>
          {data !== undefined &&
            data?.map((sendingUser) => (
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
      <ProfileModal
        selectedUser={selectedUser}
        open={modalOpen}
        handleClose={handleClose}
      />
    </Box>
  );
}
