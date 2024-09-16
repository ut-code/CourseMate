import { Box, Modal } from "@mui/material";
import UserAvatar from "./avatar";
import { User } from "../../common/types";

interface ProfileModalProps {
  selectedUser: User;
  open: boolean;
  handleClose: () => void;
}

export function ProfileModal({
  selectedUser,
  open,
  handleClose,
}: ProfileModalProps) {
  // FIXME: find a better logic
  //TODO: fix{selectedUser?.name}!!!!
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <div style={{ overflowY: "scroll", height: "100%" }}>
          <UserAvatar
            pictureUrl={selectedUser?.pictureUrl}
            width="300px"
            height="300px"
          />
          {<p>Name: {selectedUser?.name}</p>}
          {<p>ID: {selectedUser?.id}</p>}
          {<p>Grade: {selectedUser?.grade}</p>}
          {<p>Gender: {selectedUser?.gender}</p>}
          {<p>学部: {selectedUser?.faculity}</p>}
          {<p>学科: {selectedUser?.department}</p>}
          <p>Intro Short: {selectedUser?.intro}</p>
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
