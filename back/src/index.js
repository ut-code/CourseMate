import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import followingRequestRoutes from "./routes/followingRequestRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import sampleRoutes from "./routes/sampleRoutes.js";
import relationshipRoutes from "./routes/relationshipRoutes.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.WEB_ORIGIN }));

// ルートハンドラー
app.get("/", (req, res) => {
  res.json("konnnitiha");
});

// ルーティング
app.use("/users", userRoutes);
app.use("/followingRequests", followingRequestRoutes);
app.use("/courses", courseRoutes);
app.use("/enrollment", enrollmentRoutes);
app.use("/relationship", relationshipRoutes);

// サンプル
app.use("/sample", sampleRoutes);

// サーバーの起動
app.listen(port, () => {
  console.log("running");
});
