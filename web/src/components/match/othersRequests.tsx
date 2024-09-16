import { Box, List } from "@mui/material";
import request from "../../api/request";
import hooks from "../../api/hooks";
import { useState } from "react";
import { User } from "../../common/types";
import { HumanListItem } from "../human/humanListItem";
import { ProfileModal } from "../common/profileModal";

export default function OthersReq() {
  const { data, loading, error, reload } = hooks.usePendingRequestsToMe();
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
      <ProfileModal user={selectedUser} open={open} onClose={handleClose} />
    </Box>
  );
}
