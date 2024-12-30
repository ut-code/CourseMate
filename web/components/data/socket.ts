import type { Message } from "common/types";
import { enqueueSnackbar } from "notistack";
import { io } from "socket.io-client";
import { API_ENDPOINT } from "~/api/internal/endpoints";
import * as user from "~/api/user";
import { getIdToken } from "~/firebase/auth/lib";

export const socket = io(API_ENDPOINT, {
  auth: {
    serverOffset: 0, //TODO: ちゃんと実装する
  },
});

export const handlers: {
  onCreate: undefined | ((data: Message) => boolean); // should return if it matched
  onUpdate: undefined | ((id: number, data: Message) => void);
  onDelete: undefined | ((id: number) => void);
} = {
  onCreate: undefined,
  onUpdate: undefined,
  onDelete: undefined,
};

(async () => {
  const idToken = await getIdToken();
  socket.emit("register", idToken);
})();
socket.on("newMessage", async (msg: Message) => {
  if (handlers.onCreate?.(msg)) return; // if it exists and caught the create sig

  const creator = await user.get(msg.creator);
  if (!creator) return;
  enqueueSnackbar(`${creator.name}さんからのメッセージ : ${msg.content}`, {
    variant: "info",
  });
});

socket.on("updateMessage", async (msg: Message) => {
  if (handlers.onUpdate) handlers.onUpdate(msg.id, msg);
});
socket.on("deleteMessage", async (msgId: number) => {
  if (handlers.onDelete) handlers.onDelete(msgId);
});
