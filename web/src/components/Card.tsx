import { PublicUser, User } from "../common/types";
import UserAvatar from "./avatar/avatar";
import { Button } from "@mui/material";
import React from "react";
import { ProfileModal } from "./avatar/profileModal";

interface CardProps {
  displayedUser: User | PublicUser;
}

export const Card = ({ displayedUser }: CardProps) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<PublicUser | User>(
    displayedUser,
  );
  const handleOpen = (selectedUser: PublicUser | User) => {
    setModalOpen(true);
    setSelectedUser(selectedUser);
  };
  const handleClose = () => setModalOpen(false);

  return (
    <div>
      <p>Name: {displayedUser.name}</p>
      <p>id: {displayedUser.id}</p>
      <Button onClick={() => handleOpen(displayedUser)}>
        <UserAvatar
          pictureUrl={displayedUser?.pictureUrl}
          width="300px"
          height="300px"
        />
      </Button>
      <ProfileModal
        selectedUser={selectedUser}
        open={modalOpen}
        handleClose={handleClose}
      />
    </div>
  );
};
