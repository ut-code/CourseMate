import {
  Box,
  List,
  ListItem,
  Button,
  Stack,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import * as chat from "../../api/chat/chat";
import { useRoomsOverview } from "../../api/chat/hooks";
import { useState } from "react";
import { RoomOverview } from "../../common/types";

export default function Chat() {
  const { data, error, loading, reload } = useRoomsOverview();
  const [message, setMessage] = useState("");

  const submitMessage = async (room: RoomOverview) => {
    // const room = data![key];
    // const elem = document.getElementById(
    //   "message-" + key
    // ) as HTMLInputElement;
    // const text = elem.value;
    const msg = { content: message };
    if (room.isDM) await chat.sendDM(room.friendId, msg);
    else await chat.send(room.roomId, msg);
    setMessage("");
    reload();
  };

  let key = 0;
  return (
    <Box>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">Error: {error.message}</Typography>
      ) : (
        <List>
          {data !== undefined &&
            data?.map((room) => (
              <ListItem
                key={key++}
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
                        if (room.isDM) {
                          chat
                            .getDM(room.friendId)
                            .then((data) => alert(data.messages.join("\n")));
                        } else {
                          chat
                            .getSharedRoom(room.roomId)
                            .then((data) => alert(data.messages.join("\n")));
                        }
                      }}
                    >
                      チャットの内容を表示
                    </Button>
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        const form = new FormData(e.currentTarget);
                        const text = form.get("message");
                        if (text === null) return;
                        const msg = { content: String(text) };
                        if (room.isDM) await chat.sendDM(room.friendId, msg);
                        else await chat.send(room.roomId, msg);
                        reload();
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <TextField
                          name="message"
                          placeholder="メッセージ"
                          variant="outlined"
                          size="small"
                          id={"message-" + key}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                        <IconButton
                          type="submit"
                          color="primary"
                          onClick={() => {
                            submitMessage(room);
                          }}
                        >
                          <SendIcon />
                        </IconButton>
                      </Stack>
                    </form>
                  </Stack>
                }
              />
            ))}
        </List>
      )}
    </Box>
  );
}
