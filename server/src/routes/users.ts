import express, { Request, Response } from "express";
import { type PublicUser, Public, User } from "../common/types";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
  getAllUsers,
} from "../database/users";
import { searchMatchedUser, searchPendingUsers } from "../database/requests";
import { isRequester, safeGetUserId } from "../firebase/auth/db";
import { safeGetGUID } from "../firebase/auth/lib";

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

// 自分の情報を確認するエンドポイント。
router.get("/me", async (req: Request, res: Response) => {
  const guid = await safeGetGUID(req);
  if (!guid.ok) return res.status(401).send("auth error");

  try {
    const users = await getUser(guid.value);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ユーザーの存在を確認するためのエンドポイント。だれでもアクセス可能
router.get("/exists/:guid", async (req: Request, res: Response) => {
  const guid = req.params.guid;
  try {
    const user: User | null = await getUser(guid);
    if (user == null) throw new Error("user not found");
    res.status(200).send();
  } catch (error) {
    res.status(404).send();
  }
});

// 特定のユーザーとマッチしたユーザーを取得
router.get("/matched", async (req: Request, res: Response) => {
  const userId = await safeGetUserId(req);
  if (!userId.ok) return res.status(401).send("auth error: " + userId.error);

  try {
    const matchedUsers: User[] = await searchMatchedUser(userId.value);
    const safeMatched = matchedUsers.map(Public);
    res.status(200).json(safeMatched);
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
    const matchedUsers: User[] = await searchPendingUsers(userId.value);
    const safeMatched = matchedUsers.map(Public);
    res.status(200).json(safeMatched);
  } catch (error) {
    console.error("Error fetching matching requests", error);
    res.status(500).json({ error: "Failed to fetch matching requests" });
  }
});

// ユーザーの取得エンドポイント
router.get("/guid/:guid", async (req: Request, res: Response) => {
  const { guid } = req.params;

  try {
    const user = await getUser(guid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const json: PublicUser = Public(user);
    res.status(200).json(json);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// ユーザーの作成エンドポイント
router.post("/", async (req: Request, res: Response) => {
  const partialUser: Omit<User, "id"> = req.body; // is any

  try {
    const newUser = await createUser(partialUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// ユーザーの更新エンドポイント
router.put("/me", async (req: Request, res: Response) => {
  const id = await safeGetUserId(req);
  if (!id.ok) return res.status(401).send("auth error");

  if (await isRequester(req, id.value))
    return res.status(401).send("you can't update others");

  // TODO: Typia
  const user: Omit<User, "id"> = req.body;
  try {
    const updatedUser = await updateUser(id.value, user);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// ユーザーの削除エンドポイント
router.delete("/me", async (req, res) => {
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
