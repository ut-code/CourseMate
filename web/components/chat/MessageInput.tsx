import SendIcon from "@mui/icons-material/Send";
import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import type { DMOverview, SendMessage, UserID } from "../../common/types";
import { parseContent } from "../../common/zod/methods";

type Props = {
  send: (to: UserID, m: SendMessage) => void;
  room: DMOverview;
};

const crossRoomMessageState = new Map<number, string>();

export function MessageInput({ send, room }: Props) {
  const [message, _setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  function setMessage(m: string) {
    _setMessage(m);
    crossRoomMessageState.set(room.friendId, m);
  }

  useEffect(() => {
    _setMessage(crossRoomMessageState.get(room.friendId) || "");
  }, [room.friendId]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      parseContent(message);
    } catch {
      return;
    }

    if (message.trim()) {
      send(room.friendId, { content: message });
      setMessage("");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      setError(null);

      try {
        parseContent(message);
      } catch {
        return;
      }
      if (message.trim()) {
        send(room.friendId, { content: message });
        setMessage("");
      }
    }
  }

  return (
    <Box sx={{ padding: "0px" }}>
      <form onSubmit={submit}>
        <Stack direction="row" spacing={1} alignItems="center" margin={2}>
          <TextField
            name="message"
            placeholder="メッセージを入力"
            variant="outlined"
            size="small"
            value={message}
            fullWidth
            multiline
            minRows={1}
            maxRows={3}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            error={!!error}
            autoComplete="off"
          />
          <IconButton type="submit" color="primary">
            <SendIcon />
          </IconButton>
        </Stack>
        {error && (
          <Typography color="error" variant="body2" marginLeft={2}>
            {error}
          </Typography>
        )}
      </form>
    </Box>
  );
}
