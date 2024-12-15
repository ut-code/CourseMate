import { serialize } from "cookie";
import express from "express";
import { z } from "zod";
import { safeGetUserId } from "../firebase/auth/db";

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
  if (form.data.userName !== "admin" || form.data.password !== "password") {
    return res.status(401).send("Failed to login Admin Page.");
  }

  // Set cookie on successful login
  const cookie = serialize("authToken", "admin-token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  res.setHeader("Set-Cookie", cookie);
  res.status(201).json({ message: "Login successful" });
});

// 認証チェック用エンドポイント
router.get("/login", (req, res) => {
  const authToken = req.cookies?.authToken;
  if (authToken === "admin-token") {
    return res.status(200).json({ authenticated: true });
  }
  return res.status(401).json({ authenticated: false });
});

export default router;
