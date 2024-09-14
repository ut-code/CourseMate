import { Box, Modal } from "@mui/material";
import UserAvatar from "./avatar";
import { User } from "../../common/types";

interface ProfileModalProps {
  selectedUser: User | null;
  open: boolean;
  handleClose: () => void;
}

export function ProfileModal({
  selectedUser,
  open,
  handleClose,
}: ProfileModalProps) {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <div style={{ overflowY: "scroll", height: "100%" }}>
          <UserAvatar
            pictureUrl={selectedUser?.pictureUrl}
            width="300px"
            height="300px"
          />
          {selectedUser?.name && <p>Name: {selectedUser.name}</p>}
          {selectedUser?.id && <p>ID: {selectedUser.id}</p>}
          {selectedUser?.grade && <p>Grade: {selectedUser.grade}</p>}
          {selectedUser?.gender && <p>Gender: {selectedUser.gender}</p>}
          {selectedUser?.faculity && <p>Hobby: {selectedUser.faculity}</p>}
          {selectedUser?.department && <p>Hobby: {selectedUser.department}</p>}
          {selectedUser?.intro && (
            <p>Intro Short: {selectedUser.intro}</p>
          )}
        </div>
      </Box>
    </Modal>
  );
}

const modalStyle = {
  position: "absolute" as const,
  top: "10%",
  left: "25%",
  width: "50vw",
  height: "70vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflow: "auto",
};
