import {
  Box,
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
  rollUpName?: boolean; // is currently only intended to be used in Chat
  onDelete?: (id: number) => void;
  onOpen?: (user: { id: number; name: string; pictureUrl: string }) => void;
  onAccept?: (id: number) => void;
  onReject?: (id: number) => void;
  onCancel?: (id: number) => void;
  hasDots?: boolean;
  dotsActions?: object;
};

export function HumanListItem(props: HumanListItemProps) {
  const {
    id,
    name,
    pictureUrl,
    rollUpName,
    lastMessage,
    onDelete,
    onOpen,
    onAccept,
    onReject,
    onCancel,
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
          {onAccept && (
            <button
              type="button"
              onClick={() => onAccept(id)}
              className="btn border-primary bg-white text-primary"
            >
              承認
            </button>
          )}
          {onReject && (
            <button
              type="button"
              onClick={() => onReject(id)}
              className="btn border-primary bg-white text-primary"
            >
              拒否
            </button>
          )}
          {onCancel && (
            <button
              type="button"
              onClick={() => onCancel(id)}
              className="btn border-primary bg-white text-primary"
            >
              キャンセル
            </button>
          )}
        </Stack>
      }
      sx={{
        pr: 2,
      }}
    >
      <button
        type="button"
        onClick={handleOpenClick}
        className="w-full items-center justify-start"
      >
        <ListItemAvatar sx={{ marginLeft: "8px" }}>
          <UserAvatar pictureUrl={pictureUrl} width="50px" height="50px" />
        </ListItemAvatar>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginLeft: "20px",
          }}
        >
          <Typography
            variant="body1"
            noWrap
            color={"text.primary"}
            sx={{ textAlign: "left" }}
          >
            {name}
          </Typography>
          {rollUpName && (
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
              sx={{
                minHeight: "1rem",
                maxWidth: "60vw",
              }}
            >
              {lastMessage}
            </Typography>
          )}
        </Box>
      </button>
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
