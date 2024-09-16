import { Box, List } from "@mui/material";
import request from "../../api/request";
import hooks from "../../api/hooks";
import React from "react";
import { ProfileModal } from "../human/profileModal";
import { User } from "../../common/types";
import { HumanListItem } from "../human/humanListItem";

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
              <HumanListItem
                key={sendingUser.id}
                id={sendingUser.id}
                name={sendingUser.name}
                pictureUrl={sendingUser.pictureUrl}
                onOpen={() => handleOpen(sendingUser)}
                onAccept={() =>
                  request.accept(sendingUser.id).then(() => reload)
                }
                onReject={() =>
                  request.reject(sendingUser.id).then(() => reload)
                }
              />
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
