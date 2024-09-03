import { Server, Socket } from "socket.io";
import { corsOptions, server } from "../..";
import { Message, UserID } from "../../common/types";
import { getUserIdfromToken } from "../../firebase/auth/db";

const users: { [key: string]: Socket } = {};

export function initializeSocket() {
  const io = new Server(server, {
    cors: corsOptions,
    connectionStateRecovery: {},
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("register", async (token) => {
      const userId = await getUserIdfromToken(token);
      users[userId] = socket;
      console.log(`User registered: ${userId}`);
    });

    socket.on("disconnect", () => {
      for (const [id, socket2] of Object.entries(users)) {
        if (socket2.id === socket.id) {
          delete users[id];
          console.log(`User ${id} disconnected`);
          break;
        }
      }
    });
  });
}

export function sendMessage(message: Message, friendId: UserID) {
  const socket = users[friendId];
  if (socket) {
    socket.emit("newMessage", message);
    console.log(`Message sent to ${friendId}: ${message}`);
  } else {
    console.log(`User ${friendId} is not connected`);
  }
}
