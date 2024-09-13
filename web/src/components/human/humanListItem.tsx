import { ListItem, ListItemAvatar, Button, Stack } from "@mui/material";
import UserAvatar from "./avatar";

type HumanListItemProps = {
  id: number;
  name: string;
  pictureUrl: string;
  onDelete?: (id: number) => void;
  onOpen?: (user: { id: number; name: string; pictureUrl: string }) => void;
  onAccept?: (id: number) => void;
  onReject?: (id: number) => void;
};

export function HumanListItem(props: HumanListItemProps) {
  const { id, name, pictureUrl, onDelete, onOpen, onAccept, onReject } = props;
  const handleDeleteClick = () => {
    if (!window.confirm("本当にこのマッチングを削除しますか?") || !onDelete)
      return;
    onDelete(id);
  };
  const handleOpenClick = () => {
    if (!onOpen) return;
    onOpen({ id, name, pictureUrl });
  };

  return (
    <ListItem
      key={id.toString()}
      secondaryAction={
        <Stack direction="row" spacing={1}>
          {onAccept && <Button onClick={() => onAccept(id)}>承認</Button>}
          {onReject && <Button onClick={() => onReject(id)}>拒否</Button>}
          {onDelete && <Button onClick={handleDeleteClick}>削除</Button>}
        </Stack>
      }
    >
      <ListItemAvatar>
        <Button onClick={handleOpenClick}>
          <UserAvatar pictureUrl={pictureUrl} width="50px" height="50px" />
        </Button>
      </ListItemAvatar>
      <p>{name}</p>
    </ListItem>
  );
}
