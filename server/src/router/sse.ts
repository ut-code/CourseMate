import type { SSEChatEvent, SSEChatEventEnum, UserID } from "common/types";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { streamSSE } from "hono/streaming";
import { getUserIdFromToken } from "../firebase/auth/db";

export const sseChatPath = (id: UserID) => `sse:chat:${id}`;
export function send<T extends SSEChatEventEnum>(
  to: UserID,
  event: SSEChatEvent<T>,
) {
  const bc = new BroadcastChannel(sseChatPath(to));
  bc.postMessage(event);
  bc.close();
}

// https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API
// https://hono.dev/docs/helpers/streaming
const route = new Hono().get("/chat", async (c) => {
  const token = c.req.query("token");
  if (!token)
    throw new HTTPException(400, {
      message: "token required in param",
    });

  const userId = await getUserIdFromToken(token);
  return streamSSE(c, async (stream) => {
    const bc = new BroadcastChannel(sseChatPath(userId));
    bc.onmessage = (e: MessageEvent) => {
      const event = e.data as SSEChatEvent<SSEChatEventEnum>;
      stream.writeSSE({
        event: event.event,
        data: JSON.stringify(event.data),
      });
    };

    stream.onAbort(() => {
      bc.close();
    });
    while (true) {
      await Bun.sleep(2000);
      stream.writeSSE({
        event: "Ping",
        data: "",
      });
    }
  });
});

export default route;
