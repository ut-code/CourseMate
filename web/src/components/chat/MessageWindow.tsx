import { SxProps, Theme } from "@mui/material";
import { DMOverview, DMRoom, SendMessage, UserID } from "../../common/types";
import { MessageInput } from "./MessageInput";

type Prop = {
  data: DMRoom;
  send: (to: UserID, m: SendMessage) => void;
  room: DMOverview;
  sx?: SxProps<Theme>;
};

export function MessageWindow(props: Prop) {
  const { send, room, data } = props;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "92%",
        padding: 4,
      }}
    >
      <div style={{ flexGrow: 1, overflowY: "auto" }}>
        {data.messages.map((m) => (
          <div key={m.id}>{m.content}</div>
        ))}
      </div>
      <MessageInput send={send} room={room} />
    </div>
  );
}
