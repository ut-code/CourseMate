import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "./lib/cross-origin/multiorigin-cors";
import nocsrf from "./lib/cross-origin/block-unknown-origin";
import usersRoutes from "./routes/users";
import coursesRoutes from "./routes/courses";
import requestsRoutes from "./routes/requests";
import matchesRoutes from "./routes/matches";
import echoRoutes from "./routes/echo";
import cookieParser from "cookie-parser";

const app = express();
const port = 3000;
const allowedOrigins = [
  process.env.SERVER_ORIGIN ?? "http://localhost:3000", // delete this fallback when you think everyone has updated their .env
  process.env.WEB_ORIGIN,
  process.env.MOBILE_ORIGIN,
  process.env.WEB_ORIGIN_BUILD,
];
const corsOptions = {
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
app.use("/echo", echoRoutes);

// サーバーの起動
app.listen(port, () => {
  console.log("running");
});
