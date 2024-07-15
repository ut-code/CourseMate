import express from "express";
import cors from "cors";
import usersRoutes from "./routes/users";
import coursesRoutes from "./routes/courses";
import requestsRoutes from "./routes/requests";
import matchesRoutes from "./routes/matches";
import cookieParser from "cookie-parser";
import mustBeLoggedIn from "./middleware/must-be-logged-in";
require("dotenv").config();

const app = express();
const port = 3000;
const allowedOrigins = [
  process.env.WEB_ORIGIN,
  process.env.MOBILE_ORIGIN,
  process.env.WEB_ORIGIN_BUILD,
];
const corsOptions = {
  origin: function(
    origin: string | undefined,
    callback: (error: Error | null, flag?: boolean) => void
  ) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(mustBeLoggedIn);

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
