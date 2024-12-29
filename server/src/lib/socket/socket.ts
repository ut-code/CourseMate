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
    console.log(`[log:ws] New connection created of id ${socket.id}`);
    socket.on("register", async (token) => {
      const userId = await getUserIdFromToken(token);
      if (userId) {
        users.set(userId, socket);
        console.log(
          `[log:ws] The user of id ${socket.id} turned out to have id ${userId}`,
        );
      } else {
        console.log("[log:ws] Invalid token or failed to retrieve user ID");
      }
    });

    socket.on("disconnect", () => {
      console.log(`[log:ws] A user disconnected of id ${socket.id}`);
      for (const [id, socket2] of users.entries()) {
        if (socket2.id === socket.id) {
          console.log(`[log:ws] ... whose userId is ${id}`);
          users.delete(id);
          break;
        }
      }
    });
  });
}

export function sendMessage(message: Message, friendId: UserID) {
  console.log("[log:ws] got request for creating message.");
  const socket = users.get(friendId);
  if (socket) {
    console.log("[log:ws] Sending message...");
    socket.emit("newMessage", message);
  }
}

export function updateMessage(message: Message, friendId: UserID) {
  console.log("[log:ws] got request for updating message.");
  const socket = users.get(friendId);
  if (socket) {
    console.log("[log:ws] Updating message...");
    socket.emit("updateMessage", message);
  }
}

export function deleteMessage(messageId: number, friendId: UserID) {
  console.log("[log:ws] got request for deleting message.");
  const socket = users.get(friendId);
  if (socket) {
    console.log("[log:ws] Deleting message...");
    socket.emit("deleteMessage", messageId);
  }
}
