import type { Message } from "common/types";
import type { SSEChatEvents } from "common/types";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { API_ENDPOINT } from "~/api/internal/endpoints";
import * as user from "~/api/user";
import { getIdToken } from "~/firebase/auth/lib";

export const handlers: {
  onCreate: undefined | ((data: Message) => boolean); // should return if it matched
  onUpdate: undefined | ((id: number, data: Message) => void);
  onDelete: undefined | ((id: number) => void);
} = {
  onCreate: undefined,
  onUpdate: undefined,
  onDelete: undefined,
};

async function main({ signal }: { signal: AbortSignal }) {
  const sse = new EventSource(
    `${API_ENDPOINT}/sse/chat?token=${await getIdToken()}`,
  );
  signal.addEventListener("abort", () => sse.close());

  sse.addEventListener(
    "Chat:Append",
    async (ev) => {
      console.log(ev);
      const data = JSON.parse(ev.data) as SSEChatEvents["Chat:Append"];
      const msg = data.message;
      // if it exists and caught the create sig
      if (handlers.onCreate?.(msg)) return;
      const creator = await user.get(msg.creator);
      if (!creator) return;
      enqueueSnackbar(`${creator.name}さんからのメッセージ : ${msg.content}`, {
        variant: "info",
      });
    },
    { signal },
  );
  sse.addEventListener(
    "Chat:Update",
    (ev) => {
      console.log(ev);
      const data = JSON.parse(ev.data) as SSEChatEvents["Chat:Update"];
      const msg = data.message;
      handlers.onUpdate?.(msg.id, msg);
    },
    { signal },
  );
  sse.addEventListener(
    "Chat:Delete",
    (ev) => {
      console.log(ev);
      const data = JSON.parse(ev.data) as SSEChatEvents["Chat:Delete"];
      handlers.onDelete?.(data.id);
    },
    { signal },
  );

  return () => sse.close();
}

export default function SSEProvider({
  children,
}: { children: React.ReactNode }) {
  useEffect(() => {
    const ctl = new AbortController();
    main({ signal: ctl.signal }).catch(console.error);
    return () => ctl.abort();
  }, []);
  return children;
}
