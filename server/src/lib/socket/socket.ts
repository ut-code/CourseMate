import type { Server } from "node:http";
import type { CorsOptions } from "cors";
import { type Socket, Server as SocketIOServer } from "socket.io";
import type { Message, UserID } from "../../common/types";
import { getUserIdfromToken } from "../../firebase/auth/db";

const users = new Map<UserID, Socket>();

export function initializeSocket(server: Server, corsOptions: CorsOptions) {
  const io = new SocketIOServer(server, {
    cors: corsOptions,
    connectionStateRecovery: {},
  });

  io.on("connection", (socket) => {
    socket.on("register", async (token) => {
      const userId = await getUserIdfromToken(token);
      if (userId) {
        users.set(userId, socket);
      } else {
        console.log("Invalid token or failed to retrieve user ID");
      }
    });

    socket.on("disconnect", () => {
      for (const [id, socket2] of users.entries()) {
        if (socket2.id === socket.id) {
          users.delete(id);
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
  }
}

export function updateMessage(message: Message, friendId: UserID) {
  const socket = users.get(friendId);
  if (socket) {
    socket.emit("updateMessage", message);
  }
}

export function deleteMessage(messageId: number, friendId: UserID) {
  const socket = users.get(friendId);
  if (socket) {
    socket.emit("deleteMessage", messageId);
  }
}
