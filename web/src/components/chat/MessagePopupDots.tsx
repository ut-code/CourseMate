import React, { useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Popper } from "@mui/base/Popper";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
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
      <div
        style={{ position: "relative", display: "inline" }}
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
      </div>
    </ClickAwayListener>
  );
}
