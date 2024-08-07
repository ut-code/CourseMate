import { DMOverview, DMRoom, SendMessage, UserID } from "../../common/types";
import { MessageInput } from "./MessageInput";

type Prop = {
  data: DMRoom;
  send: (to: UserID, m: SendMessage) => void;
  room: DMOverview;
};

export function MessageWindow(props: Prop) {
  const { send, room, data } = props;
  return (
    <>
      <div>
        {data.messages.map((m) => (
          <div key={m.id}>{m.content}</div>
        ))}
      </div>
      <MessageInput send={send} room={room} />
    </>
  );
}
