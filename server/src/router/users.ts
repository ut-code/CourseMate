import express, { Request, Response } from "express";
import { PublicUser, UpdateUser, User, GUID } from "../common/types";
import {
  createUser,
  deleteUser,
  getUser,
  updateUser,
  getAllUsers,
  getUserByID,
} from "../database/users";
import {
  getPendingRequestsFromUser,
  getPendingRequestsToUser,
  getMatchedUser,
} from "../database/requests";
import { safeGetUserId } from "../firebase/auth/db";
import { safeGetGUID } from "../firebase/auth/lib";
import { getMatchesByUserId } from "../database/matches";
import { parseInitUser, parseUpdateUser } from "../common/zod/methods";

const router = express.Router();

export function Public(u: User): PublicUser {
  return {
    id: u.id,
    name: u.name,
    pictureUrl: u.pictureUrl,
    intro_short: u.intro_short,
  };
}

// 全ユーザーの取得エンドポイント
router.get("/", async (req: Request, res: Response) => {
  const users = await getAllUsers();
  if (!users.ok) {
    console.error(users.error);
    return res.status(500).send();
  }
  const userId = await safeGetUserId(req);
  if (!userId.ok) return res.status(401).send("auth error");

  const matches = await getMatchesByUserId(userId.value);
  if (!matches.ok) return res.status(500).send();

  users.value.forEach((user) => {
    const isMatched = matches.value.some(
      (match) =>
        match.sendingUserId === user.id || match.receivingUserId === user.id,
    );
    if (!isMatched) {
      user.grade = "";
      user.gender = "";
      user.hobby = "";
      user.intro_long = "";
    }
  });

  res.status(200).json(users.value);
});

// 全ユーザーの公開情報の取得エンドポイント
router.get("/public", async (req: Request, res: Response) => {
  const users = await getAllUsers();
  if (!users.ok) {
    console.error(users.error);
    return res.status(500).send();
  }
  const safeUsers = users.value.map(Public);
  res.status(200).json(safeUsers);
});

// 自分の情報を確認するエンドポイント。
router.get("/me", async (req: Request, res: Response) => {
  const guid = await safeGetGUID(req);
  if (!guid.ok) return res.status(401).send("auth error");

  const user = await getUser(guid.value);
  if (!user.ok) {
    if (user.error === 404) return res.status(404).send();
    console.error(user.error);
    return res.status(500).send();
  }
  res.status(200).json(user.value);
});

// ユーザーの存在を確認するためのエンドポイント。だれでもアクセス可能
router.get("/exists/:guid", async (req: Request, res: Response) => {
  const guid = req.params.guid;
  const user = await getUser(guid as GUID);
  res.status(user.ok ? 200 : 404).send();
});

// 特定のユーザーとマッチしたユーザーを取得
router.get("/matched", async (req: Request, res: Response) => {
  const userId = await safeGetUserId(req);
  if (!userId.ok) return res.status(401).send("auth error: " + userId.error);

  const matchedUsers = await getMatchedUser(userId.value);
  if (!matchedUsers.ok) return res.status(500).send();

  res.status(200).json(matchedUsers.value);
});

// ユーザーにリクエストを送っているユーザーを取得 状態はPENDING
router.get("/pending/to-me", async (req: Request, res: Response) => {
  const userId = await safeGetUserId(req);
  if (!userId.ok) return res.status(401).send("auth error: " + userId.error);

  const sendingUsers = await getPendingRequestsToUser(userId.value);
  if (!sendingUsers.ok) {
    console.log(sendingUsers.error);
    return res.status(500).send();
  }
  const safeUsers = sendingUsers.value.map(Public);
  res.status(200).json(safeUsers);
});

// ユーザーがリクエストを送っているユーザーを取得 状態はPENDING
router.get("/pending/from-me", async (req: Request, res: Response) => {
  const userId = await safeGetUserId(req);
  if (!userId.ok) return res.status(401).send("auth error: " + userId.error);

  const receivers = await getPendingRequestsFromUser(userId.value);
  if (!receivers.ok) {
    console.log(receivers.error);
    return res.status(500).send();
  }
  const safeUsers = receivers.value.map(Public);
  res.status(200).json(safeUsers);
});

// guidによるユーザーの取得エンドポイント
router.get("/guid/:guid", async (req: Request, res: Response) => {
  const { guid } = req.params;

  const user = await getUser(guid as GUID);
  if (!user.ok) {
    return res.status(404).json({ error: "User not found" });
  }
  const json: PublicUser = Public(user.value);
  res.status(200).json(json);
});

//idによるユーザーの取得エンドポイント
router.get("/id/:id", async (req: Request, res: Response) => {
  const userId = await safeGetUserId(req);
  if (!userId.ok) return res.status(401).send("auth error: " + userId.error);
  const user = await getUserByID(userId.value);
  if (!user.ok) {
    return res.status(404).json({ error: "User not found" });
  }
  const json: PublicUser = Public(user.value);
  res.status(200).json(json);
});

// ユーザーの作成エンドポイント
router.post("/", async (req: Request, res: Response) => {
  const partialUser: Omit<User, "id"> = req.body;
  try {
    parseInitUser(partialUser);
  } catch (e) {
    return res.status(400).send("invalid format");
  }

  const user = await createUser(partialUser);
  if (!user.ok) return res.status(500).send();
  res.status(201).json(user.value);
});

// ユーザーの更新エンドポイント
router.put("/me", async (req: Request, res: Response) => {
  const id = await safeGetUserId(req);
  if (!id.ok) return res.status(401).send("auth error");

  const user: UpdateUser = req.body;
  try {
    parseUpdateUser(user);
  } catch (e) {
    return res.status(400).send("invalid format");
  }
  const updated = await updateUser(id.value, user);
  if (!updated.ok) return res.status(500).send();
  res.status(200).json(updated.value);
});

// ユーザーの削除エンドポイント
router.delete("/me", async (req, res) => {
  const id = await safeGetUserId(req);
  if (!id.ok) return res.status(401).send("auth error");

  const deleted = await deleteUser(id.value);
  if (!deleted.ok) return res.status(500).send();
  res.status(204).send();
});

export default router;
