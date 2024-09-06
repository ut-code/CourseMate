import { io } from "socket.io-client";

const URL = import.meta.env.VITE_API_ENDPOINT;

export const socket = io(URL, {
  auth: {
    serverOffset: 0, //TODO: ちゃんと実装する
  },
});
