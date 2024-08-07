import { SxProps, Theme } from "@mui/material";
import { Box, Paper, Typography } from "@mui/material";
import { DMOverview, DMRoom, SendMessage, UserID } from "../../common/types";
import { MessageInput } from "./MessageInput";
import { getMyId } from "../../api/user";

type Prop = {
  data: DMRoom;
  send: (to: UserID, m: SendMessage) => void;
  room: DMOverview;
  sx?: SxProps<Theme>;
};

const id = await getMyId();

export function MessageWindow(props: Prop) {
  const { send, room, data } = props;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "92%",
        padding: 2,
        ...props.sx,
      }}
    >
      <Box sx={{ flexGrow: 1, overflowY: "auto", padding: 1 }}>
        {data.messages.map((m) => (
          <Box
            key={m.id}
            sx={{
              display: "flex",
              justifyContent: m.creator === id ? "flex-end" : "flex-start",
              marginBottom: 1,
            }}
          >
            <Paper
              sx={{
                display: "flex",
                maxWidth: "60%",
                padding: 1,
                borderRadius: 2,
                backgroundColor: m.creator === id ? "#DCF8C6" : "#FFF",
                boxShadow: 1,
                border: 1,
              }}
            >
              <Typography>{m.content}</Typography>
            </Paper>
          </Box>
        ))}
      </Box>
      <MessageInput send={send} room={room} />
    </Box>
  );
}
