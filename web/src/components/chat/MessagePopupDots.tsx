import React, { useState } from "react";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Popper } from "@mui/base/Popper";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import { Message } from "../../common/types";
import MessagePopup from "./MessagePopup";

type Props = {
  message: Message;
  reload: () => void;
};
export default function MessagePopupDots({ message, reload }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchor(open ? null : event.currentTarget);
    setOpen(!open);
  };

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <div>
        {/* FIXME:
              1. MoreHorizon icon doesn't show up 
              2. it doesn't want to align to right top
        */}
        <MoreHorizIcon
          aria-describedby="open popup that edits message"
          component={"div"} // ?
          color="info"
          onClick={handleClick}
        />
        <Popper
          open={open}
          anchorEl={anchor}
          style={{
            position: "absolute",
          }}
        >
          <MessagePopup message={message} reload={reload} />
        </Popper>
      </div>
    </ClickAwayListener>
  );
}
