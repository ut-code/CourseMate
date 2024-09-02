import { Server, Socket } from "socket.io";
import { corsOptions, server } from "../..";

export function initializeSocket() {
  // Socket.IOの初期化
  const io = new Server(server, {
    cors: corsOptions,
    connectionStateRecovery: {},
  });

  //Socketをfriend key に基づいて保存
  const users: { [key: string]: Socket } = {};

  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("register", (userId) => {
      users[userId] = socket;
      console.log(`User registered: ${userId}`);
    });

    socket.on("chat message", (data) => {
      const { friendId, message } = data;
      const socket = users[friendId];
      if (socket) {
        socket.emit("newMessage", message);
        console.log(`Message sent to ${friendId}: ${message}`);
      } else {
        console.log(`User ${friendId} is not connected`);
      }
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
