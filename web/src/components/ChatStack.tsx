import {
  Button,
  Stack,
  Typography,
  ListItem,
  TextField,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { DMOverview, SendMessage, UserID } from "../common/types";
import { useState } from "react";
import * as chat from "../api/chat/chat";

type Props = {
  send: (to: UserID, m: SendMessage) => void;
  room: DMOverview;
};

export function ChatStack(props: Props) {
  const { room, send } = props;

  const [message, setMessage] = useState<string>("");

  return (
    <ListItem
      key={room.friendId}
      sx={{
        mb: 1,
        border: "2px solid #1976D2",
        borderRadius: 1,
        padding: 5,
      }}
      secondaryAction={
        <Stack
          direction={"row"}
          spacing={2}
          alignItems="center"
          textAlign={"center"}
        >
          <Typography variant="body2">{room.name}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              chat
                .getDM(room.friendId)
                .then((data) =>
                  alert(data.messages.map((m) => m.content).join("\n")),
                );
            }}
          >
            チャットの内容を表示
          </Button>
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
                onChange={(e) => setMessage(e.target.value)}
              />
              <IconButton type="submit" color="primary">
                <SendIcon />
              </IconButton>
            </Stack>
          </form>
        </Stack>
      }
    />
  );
}
