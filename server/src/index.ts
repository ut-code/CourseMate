import express from "express";
import cors from "./lib/cors/index";
import usersRoutes from "./routes/users";
import coursesRoutes from "./routes/courses";
import requestsRoutes from "./routes/requests";
import matchesRoutes from "./routes/matches";
require("dotenv").config();

const app = express();
const port = 3000;
const allowedOrigins = [
  process.env.WEB_ORIGIN,
  process.env.MOBILE_ORIGIN,
  process.env.WEB_ORIGIN_BUILD,
];
const corsOptions = {
  allowedOrigins: allowedOrigins.map(s => s || ""),
  allowMethods: ["GET", "HEAD", "POST", "PUT", "DELETE"],
};
app.use(cors.clientSide(corsOptions));
app.use(cors.serverSide(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json("Hello from Express!");
});

// ルーティング
app.use("/users", usersRoutes);
app.use("/courses", coursesRoutes);
app.use("/requests", requestsRoutes);
app.use("/matches", matchesRoutes);

// サーバーの起動
app.listen(port, () => {
  console.log("running");
});
