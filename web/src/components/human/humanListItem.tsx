import {
  Box,
  Button,
  ListItem,
  ListItemAvatar,
  Stack,
  Typography,
} from "@mui/material";
import UserAvatar from "./avatar";

import Dots from "../common/Dots";

type HumanListItemProps = {
  id: number;
  name: string;
  pictureUrl: string;
  lastMessage?: string;
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
    lastMessage,
    onDelete,
    onOpen,
    onAccept,
    onReject,
    hasDots,
  } = props;
  const handleDeleteClick = () => {
    if (!onDelete) return;
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
      sx={{
        pr: 2,
      }}
    >
      <ListItemAvatar sx={{ marginLeft: "8px" }}>
        <Button onClick={handleOpenClick}>
          <UserAvatar pictureUrl={pictureUrl} width="50px" height="50px" />
        </Button>
      </ListItemAvatar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          marginLeft: "20px",
        }}
      >
        <Typography variant="body1" noWrap>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {lastMessage || ""}
        </Typography>
      </Box>
      {hasDots && (
        <Box
          sx={{
            position: "absolute",
            right: "16px",
            top: "50%",
            transform: "translateY(-50%)", // コンポーネントの自身の高さの半分だけ上にずらす
          }}
        >
          <Dots
            actions={[
              {
                label: "詳細",
                onClick: handleOpenClick,
                alert: false,
              },
              {
                label: "削除",
                color: "red",
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
        </Box>
      )}
    </ListItem>
  );
}
