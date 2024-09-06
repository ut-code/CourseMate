import { Server, Socket } from "socket.io";
import { corsOptions, server } from "../..";
import { Message, UserID } from "../../common/types";
import { getUserIdfromToken } from "../../firebase/auth/db";

const users = new Map<UserID, Socket>();

export function initializeSocket() {
  const io = new Server(server, {
    cors: corsOptions,
    connectionStateRecovery: {},
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("register", async (token) => {
      const userId = await getUserIdfromToken(token);
      if (userId) {
        users.set(userId, socket);
        console.log(`User registered: ${userId}`);
      } else {
        console.log("Invalid token or failed to retrieve user ID");
      }
    });

    socket.on("disconnect", () => {
      for (const [id, socket2] of users.entries()) {
        if (socket2.id === socket.id) {
          users.delete(id);
          console.log(`User ${id} disconnected`);
          break;
        }
      }
    });
  });
}

export function sendMessage(message: Message, friendId: UserID) {
  const socket = users.get(friendId);
  if (socket) {
    socket.emit("newMessage", message);
    console.log(`Message sent to ${friendId}: ${message}`);
  } else {
    console.log(`User ${friendId} is not connected`);
  }
}
