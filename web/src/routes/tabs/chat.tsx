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
  const [messages, setMessages] = useState<{ [key: string]: string }>({});

  const handleChange = (friendId: number, value: string) => {
    setMessages((prevMessages) => ({
      ...prevMessages,
      [friendId]: value,
    }));
  };

  const submitMessage = async (room: RoomOverview) => {
    if (room.isDM) {
      const msg = { content: messages[room.friendId] || "" };
      await chat.sendDM(room.friendId, msg);
    } else {
      const msg = { content: messages[room.roomId] || "" };
      await chat.send(room.roomId, msg);
    }
    setMessages({});
    reload();
  };

  return (
    <Box>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">Error: {error.message}</Typography>
      ) : (
        <List>
          {data !== undefined &&
            data?.map((room) => {
              if (room.isDM) {
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
                              .then((data) => alert(data.messages.join("\n")));
                          }}
                        >
                          チャットの内容を表示
                        </Button>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            submitMessage(room);
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <TextField
                              name="message"
                              placeholder="メッセージ"
                              variant="outlined"
                              size="small"
                              value={messages[room.friendId] || ""}
                              onChange={(e) =>
                                handleChange(room.friendId, e.target.value)
                              }
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
              } else {
                return (
                  <Typography key={room.roomId} variant="body2" sx={{ mb: 1 }}>
                    グループチャット: {room.name}
                  </Typography>
                );
              }
            })}
        </List>
      )}
    </Box>
  );
}
