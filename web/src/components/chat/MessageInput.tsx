import { IconButton, Stack, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import { DMOverview, SendMessage, UserID } from "../../common/types";

type Props = {
  send: (to: UserID, m: SendMessage) => void;
  room: DMOverview;
};

export function MessageInput(props: Props) {
  const [message, setMessage] = useState<string>("");
  const { send, room } = props;
  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(room.friendId, {
            content: message,
          });
          setMessage("");
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            name="message"
            placeholder="メッセージ"
            variant="outlined"
            size="small"
            value={message}
            fullWidth={true}
            onChange={(e) => setMessage(e.target.value)}
          />
          <IconButton type="submit" color="primary">
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
    </>
  );
}
