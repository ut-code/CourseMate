import { IconButton, Stack, TextField, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useState } from "react";
import { DMOverview, SendMessage, UserID } from "../../common/types";
import { parseMessage } from "../../common/zod/methods";

type Props = {
  send: (to: UserID, m: SendMessage) => void;
  room: DMOverview;
};

const crossRoomMessageState = new Map<number, string>();

export function MessageInput(props: Props) {
  const { send, room } = props;

  const [message, _setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const setMessage = (m: string) => {
    _setMessage(m);
    crossRoomMessageState.set(room.friendId, m);
  };

  // change input message based on currently open room
  useEffect(() => {
    _setMessage(crossRoomMessageState.get(room.friendId) || "");
  }, [room.friendId]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);

          try {
            parseMessage(message);
          } catch (e) {
            setError("適切なフォーマットではありません。");
            return;
          }

          if (message.trim()) {
            send(room.friendId, {
              content: message,
            });
            setMessage("");
          }
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" margin={2}>
          <TextField
            name="message"
            placeholder="メッセージを入力"
            variant="outlined"
            size="small"
            value={message}
            fullWidth={true}
            onChange={(e) => setMessage(e.target.value)}
            error={!!error}
          />
          <IconButton type="submit" color="primary">
            <SendIcon />
          </IconButton>
        </Stack>
        {error && ( // エラーメッセージがある場合に表示
          <Typography color="error" variant="body2" marginLeft={2}>
            {error}
          </Typography>
        )}
      </form>
    </>
  );
}
