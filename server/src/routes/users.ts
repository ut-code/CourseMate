import express, { Request, Response } from "express";
import { type PublicUser, Public, User } from "../../../common/types";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
  getAllUsers,
} from "../database/users";
import {
  searchMatchedUser,
} from "../database/requests";

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
  if (didItFail)
    return res.status(401).send("auth error");

  try {
    const matchedUsers: User[] = await searchMatchedUser(userId);
    // パスワード以外を返す
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
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    res.status(200).json({
      // パスワード以外の情報
      id: user.id,
      uid: user.uid,
      name: user.name,
      email: user.email,
      pictureUrl: user.pictureUrl,
    });
=======
    const json: PublicUser = Public(user);
    res.status(200).json(json);
>>>>>>> Stashed changes
=======
    const json: PublicUser = Public(user);
    res.status(200).json(json);
>>>>>>> Stashed changes
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// ユーザーの作成エンドポイント
router.post("/", async (req: Request, res: Response) => {
<<<<<<< Updated upstream
<<<<<<< HEAD
<<<<<<< Updated upstream
  const { uid, name, email, password } = req.body;
=======
  const { uid, name, email, password, pictureUrl } = req.body;
>>>>>>> main

  try {
    const newUser = await createUser({
      uid,
      name,
      email,
      password,
      pictureUrl,
    });
    res.status(201).json({
      // パスワード以外の情報
      id: newUser.id,
      uid: newUser.uid,
      name: newUser.name,
      email: newUser.email,
      pictureUrl: newUser.pictureUrl,
    });
=======
  // TODO: insert Typia
  const partialUser: Omit<User, "id"> = req.body; // is any

  try {
    const newUser = await createUser(partialUser);
    res.status(201).json(newUser);
>>>>>>> Stashed changes
=======
  // TODO: insert Typia
  const partialUser: Omit<User, "id"> = req.body; // is any

  try {
    const newUser = await createUser(partialUser);
    res.status(201).json(newUser);
>>>>>>> Stashed changes
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// ユーザーの更新エンドポイント
<<<<<<< Updated upstream
<<<<<<< Updated upstream
router.put("/:userId", async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { name, email, password, pictureUrl } = req.body;

  const updateData: {
    name?: string;
    email?: string;
    password?: string;
    pictureUrl?: string;
  } = {};
  if (email) updateData.email = email;
  if (name) updateData.name = name;
  if (password) updateData.password = password;
  if (pictureUrl) updateData.pictureUrl = pictureUrl;

  // 更新する属性が一つも指定されていない場合はエラー
  if (Object.keys(updateData).length === 0) {
    return res.status(400).send({ message: "No update fields provided" });
  }
=======
router.put("/id/:userId", async (req: Request, res: Response) => {
  // TODO: handle non-int
  const userId = parseInt(req.params.userId); 
>>>>>>> Stashed changes
=======
router.put("/id/:userId", async (req: Request, res: Response) => {
  // TODO: handle non-int
  const userId = parseInt(req.params.userId); 
>>>>>>> Stashed changes

  // TODO: Typia
  const user: Omit<User, "id"> = req.body;
  try {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    const updatedUser = await updateUser({
      userId: parseInt(userId),
      ...updateData,
    });
    res.status(200).json({
      // パスワード以外の情報
      id: updatedUser.id,
      uid: updatedUser.uid,
      name: updatedUser.name,
      email: updatedUser.email,
      pictureUrl: updatedUser.pictureUrl,
    });
=======
    const updatedUser = await updateUser(userId, user);
    res.status(200).json(updatedUser);
>>>>>>> Stashed changes
=======
    const updatedUser = await updateUser(userId, user);
    res.status(200).json(updatedUser);
>>>>>>> Stashed changes
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
