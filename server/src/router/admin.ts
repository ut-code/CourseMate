import { safeParseInt } from "common/lib/result/safeParseInt";
import { serialize } from "cookie";
import express from "express";
import { z } from "zod";
import { safeGetUserId } from "../firebase/auth/db";
import * as core from "../functions/chat";
import * as ws from "../lib/socket/socket";

const router = express.Router();

export const adminLoginForm = z.object({
  userName: z.string(),
  password: z.string(),
});

router.post("/login", async (req, res) => {
  const user = await safeGetUserId(req);
  if (!user.ok) return res.status(401).send("auth error");

  const form = adminLoginForm.safeParse(req.body);
  if (!form.success) {
    return res.status(422).send("invalid format");
  }
  if (form.data.userName !== "admin" && form.data.password !== "password") {
    return res.status(401).send("Failed to login Admin Page.");
  }
  // // 認証成功時にCookieを設定
  // const cookie = serialize("authToken", "admin-token", {
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === "production",
  //   sameSite: "strict",
  //   path: "/",
  //   maxAge: 60 * 60 * 24, // 1日
  // });

  res.status(201).json({ message: "Login successful" });
});

export default router;
