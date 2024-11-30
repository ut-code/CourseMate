import type { DMOverview, SendMessage, UserID } from "common/types";
import { parseContent } from "common/zod/methods";
import { useEffect, useState } from "react";
import { MdSend } from "react-icons/md";

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
    <div className="p-0">
      <form onSubmit={submit}>
        <div className="flex items-center space-x-2 p-2">
          <textarea
            name="message"
            placeholder="メッセージを入力"
            className={`textarea textarea-bordered w-full resize-none ${
              error ? "textarea-error" : ""
            }`}
            value={message}
            rows={1}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          <button
            type="submit"
            className="btn btn-primary btn-circle flex items-center justify-center"
          >
            <MdSend />
          </button>
        </div>
        {error && <p className="ml-2 text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}
