import type { Server } from "node:http";
import type { Message, UserID } from "common/types";
import type { CorsOptions } from "cors";
import { type Socket, Server as SocketIOServer } from "socket.io";
import { getUserIdFromToken } from "../../firebase/auth/db";

const users = new Map<UserID, Socket>();

export function initializeSocket(server: Server, corsOptions: CorsOptions) {
  const io = new SocketIOServer(server, {
    cors: corsOptions,
    connectionStateRecovery: {},
  });

  io.on("connection", (socket) => {
    console.log(`New connection created of id ${socket.id}`);
    socket.on("register", async (token) => {
      const userId = await getUserIdFromToken(token);
      if (userId) {
        users.set(userId, socket);
        console.log(
          `The user of id ${socket.id} turned out to have id ${userId}`,
        );
      } else {
        console.log("Invalid token or failed to retrieve user ID");
      }
    });

    socket.on("disconnect", () => {
      console.log(`A user disconnected of id ${socket.id}`);
      for (const [id, socket2] of users.entries()) {
        if (socket2.id === socket.id) {
          console.log(`... whose userId is ${id}`);
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
