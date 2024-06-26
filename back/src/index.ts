import express from "express";
import cors from "cors";
import usersRoutes from "./routes/users";
import coursesRoutes from "./routes/courses";
import requestsRoutes from "./routes/requests";
import matchesRoutes from "./routes/matches";
require("dotenv").config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.WEB_ORIGIN }));

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
