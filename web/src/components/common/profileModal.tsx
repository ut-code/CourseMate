import { Box, ClickAwayListener } from "@mui/material";
import { styled } from "@mui/system";
import { Card } from "../Card";
import { User } from "../../common/types";

const Overlay = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

type ProfileModalProps = {
  user: User | null;
  open: boolean;
  onClose: () => void;
};

export function ProfileModal({ user, open, onClose }: ProfileModalProps) {
  if (!open || !user) return null;

  return (
    <Overlay>
      <ClickAwayListener onClickAway={onClose}>
        <Box>
          <Card displayedUser={user} />
        </Box>
      </ClickAwayListener>
    </Overlay>
  );
}
