import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { ClickAwayListener, Popper } from "@mui/material";
import type React from "react";
import { useState } from "react";
import MessagePopup from "./MessagePopup";

type Props = {
  handleEdit: () => void;
  handleDelete: () => void;
};

export default function MessagePopupDots({ handleEdit, handleDelete }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchor(open ? null : event.currentTarget);
    setOpen(!open);
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <button
        type="button"
        style={{
          background: "none",
          color: "inherit",
          border: "none",
          padding: 0,
          font: "inherit",
          cursor: "pointer",
          outline: "inherit",
          position: "relative",
          display: "inline",
        }}
        onClick={handleClick}
      >
        <MoreHorizIcon
          aria-describedby="open popup that edits message"
          color="action"
        />
        <Popper
          open={open}
          anchorEl={anchor}
          style={{
            position: "absolute",
          }}
        >
          <MessagePopup handleEdit={handleEdit} handleDelete={handleDelete} />
        </Popper>
      </button>
    </ClickAwayListener>
  );
}
