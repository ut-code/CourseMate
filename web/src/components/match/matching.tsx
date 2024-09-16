import { Box, List } from "@mui/material";
import hooks from "../../api/hooks";
import { useState } from "react";
import { User } from "../../common/types";
import { HumanListItem } from "../human/humanListItem";
import { deleteMatch } from "../../api/match";
import { ProfileModal } from "../common/profileModal";

export default function Matchings() {
  const { data, loading, error, reload } = hooks.useMatchedUsers();
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
          marginRight: "40px",
        }}
      >
        {data && data.length === 0 && (
          <>
            誰ともマッチングしていません。
            <br />
            リクエストを送りましょう！
          </>
        )}
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
              onDelete={() => deleteMatch(matchedUser.id).then(() => reload())}
              hasDots
            />
          ))}
        </List>
      )}
      <ProfileModal user={selectedUser} open={open} onClose={handleClose} />
    </Box>
  );
}
