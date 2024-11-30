import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_API_ENDPOINT;

if (!URL) {
  throw new Error("process.env.NEXT_PUBLIC_API_ENDPOINT not found!");
}

export const socket = io(URL, {
  auth: {
    serverOffset: 0, //TODO: ちゃんと実装する
  },
});
