import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Popper } from "@mui/base/Popper";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import Popup from "./Popup";

type Props = {
  actions: {
    label: string;
    color?: string;
    onClick: () => void;
    alert: boolean;
    messages?: {
      buttonMessage: string;
      AlertMessage: string;
      subAlertMessage?: string;
      yesMessage: string;
    };
  }[];
};

export default function Dots(props: Props) {
  const { actions } = props;
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
        <MoreVertIcon
          aria-describedby="open popup that edits message"
          color="action"
        />
        <Popper
          open={open}
          anchorEl={anchor}
          style={{
            position: "absolute",
            zIndex: 1,
          }}
        >
          <Popup actions={actions} />
        </Popper>
      </div>
    </ClickAwayListener>
  );
}
