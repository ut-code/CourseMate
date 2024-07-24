import express, { Request, Response } from "express";
import { type PublicUser, Public, User } from "../../../common/types";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
  getAllUsers,
} from "../database/users";
import { searchMatchedUser, searchPendingUsers } from "../database/requests";

const router = express.Router();

// 全ユーザーの取得エンドポイント
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// 特定のユーザーとマッチしたユーザーを取得
router.get("/matched", async (req: Request, res: Response) => {
  const userId: number = 1; // TODO: get from auth
  const didItFail = false;
  if (didItFail) return res.status(401).send("auth error");

  try {
    const matchedUsers: User[] = await searchMatchedUser(userId);
    const safeMatched = matchedUsers.map(Public);
    res.status(200).json(safeMatched);
  } catch (error) {
    console.error("Error fetching matching requests", error);
    res.status(500).json({ error: "Failed to fetch matching requests" });
  }
});

router.get("/pending", async (req: Request, res: Response) => {
  const userId: number = 1; // TODO: get from auth
  const didItFail = false;
  if (didItFail) return res.status(401).send("auth error");

  try {
    const matchedUsers: User[] = await searchPendingUsers(userId);
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
    res.status(200).json({
      // パスワード以外の情報
      id: user.id,
      uid: user.uid,
      name: user.name,
      email: user.email,
      pictureUrl: user.pictureUrl,
    });
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
router.put("/id/:userId", async (req: Request, res: Response) => {
  // TODO: handle non-int
  const userId = parseInt(req.params.userId);

  // TODO: Typia
  const user: Omit<User, "id"> = req.body;
  try {
    const updatedUser = await updateUser(userId, user);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// ユーザーの削除エンドポイント
router.delete("/id/:userId", async (req, res) => {
  // TODO: handle non-int
  const userId = parseInt(req.params.userId);

  try {
    await deleteUser(userId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
