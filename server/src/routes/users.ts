import express, { Request, Response } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
  getAllUsers,
} from "../database/users";
import { searchMatchedUser, searchPendingUsers } from "../database/requests";
import { safeGetUserId } from "../firebase/auth/db";
import { safeGetGUID } from "../firebase/auth/lib";
import {
  parseGUID,
  parseInitUser,
  parseUpdateUser,
  parseUser,
} from "../../../common/zod/method";
import { z } from "zod";

const router = express.Router();

// 全ユーザーの取得エンドポイント
router.get("/", async (_: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// 自分の情報を確認するエンドポイント
router.get("/me", async (req: Request, res: Response) => {
  const guid = await safeGetGUID(req);
  if (!guid.ok) return res.status(401).send("auth error");

  try {
    const user = await getUser(guid.value);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// ユーザーの存在を確認するためのエンドポイント。だれでもアクセス可能
router.get("/exists/:guid", async (req: Request, res: Response) => {
  const guid = req.params.guid;
  try {
    parseGUID(guid);
    const user = await getUser(guid);
    if (user == null) throw new Error("user not found");
    res.status(200).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.errors });
    }
    res.status(404).send();
  }
});

// 特定のユーザーとマッチしたユーザーを取得
router.get("/matched", async (req: Request, res: Response) => {
  const userId = await safeGetUserId(req);
  if (!userId.ok) return res.status(401).send("auth error: " + userId.error);

  try {
    const matchedUsers = await searchMatchedUser(userId.value);
    res.status(200).json(matchedUsers);
  } catch (error) {
    console.error("Error fetching matching requests", error);
    res.status(500).json({ error: "Failed to fetch matching requests" });
  }
});

// machingStatusがpendingなユーザーを取得
router.get("/pending", async (req: Request, res: Response) => {
  const userId = await safeGetUserId(req);
  if (!userId.ok) return res.status(401).send("auth error: " + userId.error);

  try {
    const pendingUsers = await searchPendingUsers(userId.value);
    res.status(200).json(pendingUsers);
  } catch (error) {
    console.error("Error fetching pending users", error);
    res.status(500).json({ error: "Failed to fetch pending users" });
  }
});

// ユーザーの取得エンドポイント
router.get("/guid/:guid", async (req: Request, res: Response) => {
  const { guid } = req.params;

  try {
    parseGUID(guid);
    const user = await getUser(guid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// ユーザーの作成エンドポイント
router.post("/", async (req: Request, res: Response) => {
  try {
    const parsedInitUser = parseInitUser(req.body);
    const newUser = await createUser(parsedInitUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: "Failed to create user" });
    }
  }
});

// ユーザーの更新エンドポイント
router.put("/me", async (req: Request, res: Response) => {
  const id = await safeGetUserId(req);
  if (!id.ok) return res.status(401).send("auth error");

  try {
    const user = parseUpdateUser(req.body); // 更新データを検証
    const updatedUser = await updateUser(id.value, user);
    res.status(200).json(parseUser(updatedUser));
  } catch (error) {
    console.error("Error updating user:", error);
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.errors });
    } else {
      res.status(500).json({ error: "Failed to update user" });
    }
  }
});

// ユーザーの削除エンドポイント
router.delete("/me", async (req: Request, res: Response) => {
  const id = await safeGetUserId(req);
  if (!id.ok) return res.status(401).send("auth error");

  try {
    await deleteUser(id.value);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
