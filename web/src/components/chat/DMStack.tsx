import { Button, Stack, Typography, ListItem } from "@mui/material";
import { DMOverview, SendMessage, UserID } from "../../common/types";
import * as chat from "../../api/chat/chat";
import { MessageInput } from "./MessageInput";

type Props = {
  send: (to: UserID, m: SendMessage) => void;
  room: DMOverview;
};

export function DMStack(props: Props) {
  const { room, send } = props;

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
          <MessageInput send={send} room={room} />
        </Stack>
      }
    />
  );
}
