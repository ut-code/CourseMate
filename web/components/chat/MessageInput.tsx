import ImageIcon from "@mui/icons-material/Image";
import { sendImageTo } from "../../api/image";

import type { DMOverview, SendMessage, UserID } from "common/types";
import { parseContent } from "common/zod/methods";
import { useEffect, useState } from "react";
import { MdSend } from "react-icons/md";

type Props = {
  send: (to: UserID, m: SendMessage) => void;
  reload: () => void;
  room: DMOverview;
};

const crossRoomMessageState = new Map<number, string>();

export function MessageInput({ reload, send, room }: Props) {
  const friendId = room.friendId;
  const [message, _setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const isMatched = room.matchingStatus === "matched";

  function setMessage(m: string) {
    _setMessage(m);
    crossRoomMessageState.set(friendId, m);
  }

  useEffect(() => {
    _setMessage(crossRoomMessageState.get(friendId) || "");
  }, [friendId]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      parseContent(message);
    } catch {
      return;
    }

    if (message.trim()) {
      send(friendId, { content: message });
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
        send(friendId, { content: message });
        setMessage("");
      }
    }
  }

  return (
    <div className="p-0">
      <form onSubmit={submit}>
        <div className="flex items-center space-x-2 p-2">
          {isMatched && (
            <label>
              <ImageIcon />
              <input
                type="file"
                hidden
                accept="svg,png,jpg,jpeg,webp,avif"
                onChange={async (ev) => {
                  if (!ev.target.files) return;
                  for (const file of ev.target.files) {
                    // this non-concurrent await is intentional. without this, the images will be sent unordered.
                    console.log(room, room.friendId);
                    await sendImageTo(room.friendId, file).catch(console.error);
                  }
                  reload();
                }}
              />
            </label>
          )}
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
