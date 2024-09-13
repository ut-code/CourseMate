import { useState } from "react";
import { Popper } from "@mui/base/Popper";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";
import ActionPopup from "../common/ActionPopup";
import MoreVertIcon from "@mui/icons-material/MoreVert";

type Props = {
  handleInfo: () => void;
  handleDelete: () => void;
};

export default function MatchPopupDots({ handleInfo, handleDelete }: Props) {
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
          }}
        >
          <MatchPopup handleInfo={handleInfo} handleDelete={handleDelete} />
        </Popper>
      </div>
    </ClickAwayListener>
  );
}

type PopupProps = {
  handleInfo: () => void;
  handleDelete: () => void;
};
function MatchPopup(props: PopupProps) {
  const { handleInfo, handleDelete } = props;
  const actions = [
    {
      label: "詳細",
      onClick: handleInfo,
    },
    {
      label: "削除",
      onClick: handleDelete,
      confirmMessage: "このフレンドを消去しますか？",
    },
  ];

  return <ActionPopup actions={actions} />;
}
