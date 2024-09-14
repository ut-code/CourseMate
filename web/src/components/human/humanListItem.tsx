import { ListItem, ListItemAvatar, Button, Stack, Box } from "@mui/material";
import UserAvatar from "./avatar";

import Dots from "../common/Dots";

type HumanListItemProps = {
  id: number;
  name: string;
  pictureUrl: string;
  onDelete?: (id: number) => void;
  onOpen?: (user: { id: number; name: string; pictureUrl: string }) => void;
  onAccept?: (id: number) => void;
  onReject?: (id: number) => void;
  hasDots?: boolean;
  dotsActions?: object;
};

export function HumanListItem(props: HumanListItemProps) {
  const {
    id,
    name,
    pictureUrl,
    onDelete,
    onOpen,
    onAccept,
    onReject,
    hasDots,
  } = props;
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
        </Stack>
      }
    >
      <ListItemAvatar>
        <Button onClick={handleOpenClick}>
          <UserAvatar pictureUrl={pictureUrl} width="50px" height="50px" />
        </Button>
      </ListItemAvatar>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "100%",
        }}
      >
        <p style={{ flexGrow: 1 }}>{name}</p>
        {hasDots && (
          <Dots
            actions={[
              {
                label: "詳細",
                onClick: handleOpenClick,
                alert: false,
              },
              {
                label: "削除",
                onClick: handleDeleteClick,
                alert: true,
                messages: {
                  buttonMessage: "削除",
                  AlertMessage: "このフレンドを削除しますか？",
                  subAlertMessage: "この操作は取り消せません。",
                  yesMessage: "削除",
                },
              },
            ]}
          />
        )}
      </Box>
    </ListItem>
  );
}
