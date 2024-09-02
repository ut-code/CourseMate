import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "./lib/cross-origin/multiorigin-cors";
import nocsrf from "./lib/cross-origin/block-unknown-origin";
import usersRoutes from "./router/users";
import coursesRoutes from "./router/courses";
import requestsRoutes from "./router/requests";
import matchesRoutes from "./router/matches";
import chatRoutes from "./router/chat";
import cookieParser from "cookie-parser";
import { initializeSocket } from "./lib/socket/socket";

const app = express();
const port = 3000;
const allowedOrigins = [
  process.env.SERVER_ORIGIN ?? "http://localhost:3000", // delete this fallback when you think everyone has updated their .env
  process.env.WEB_ORIGIN,
  process.env.MOBILE_ORIGIN,
  process.env.WEB_ORIGIN_BUILD,
];
export const corsOptions = {
  origins: allowedOrigins.map((s) => s || "").filter((s) => s !== ""),
  methods: ["GET", "HEAD", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(nocsrf(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (_, res) => {
  res.json("Hello from Express!");
});

// ルーティング
app.use("/users", usersRoutes);
app.use("/courses", coursesRoutes);
app.use("/requests", requestsRoutes);
app.use("/matches", matchesRoutes);
app.use("/chat", chatRoutes);

// サーバーの起動
export const server = app.listen(port, () => {
  console.log("running");
});
initializeSocket();
