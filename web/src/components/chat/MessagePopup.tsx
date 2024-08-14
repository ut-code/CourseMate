import { deleteMessage, updateMessage } from "../../api/chat/chat";
import { Message } from "../../common/types";

export default function MessagePopup({
  message,
  reload,
}: {
  message: Message;
  reload: () => void;
}) {
  return (
    <>
      <button
        onClick={async () => {
          await updateMessage(message.id, {
            content: "このメッセージは更新されました",
          });
          reload();
        }}
      >
        update
      </button>
      <button
        onClick={async () => {
          await deleteMessage(message.id);
          reload();
        }}
      >
        delete
      </button>
    </>
  );
}
