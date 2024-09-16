import { Box, List } from "@mui/material";
import hooks from "../../api/hooks";
import React from "react";
import { ProfileModal } from "../human/profileModal";
import { User } from "../../common/types";
import { HumanListItem } from "../human/humanListItem";
import { deleteMatch } from "../../api/match";

export default function Matchings() {
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
      <p>
        {data &&
          data.length === 0 &&
          "誰ともマッチングしていません。リクエストを送りましょう！"}
      </p>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error.message}</p>
      ) : (
        <List>
          {data?.map((matchedUser) => (
            <HumanListItem
              key={matchedUser.id}
              id={matchedUser.id}
              name={matchedUser.name}
              pictureUrl={matchedUser.pictureUrl}
              onOpen={() => handleOpen(matchedUser)}
              onDelete={() => deleteMatch(matchedUser.id).then(() => reload)}
              hasDots
            />
          ))}
        </List>
      )}
      <ProfileModal //TODO: change to Card!
        selectedUser={selectedUser!}
        open={modalOpen}
        handleClose={handleClose}
      />
    </Box>
  );
}
