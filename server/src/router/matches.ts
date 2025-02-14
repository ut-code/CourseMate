import { error } from "common/lib/panic";
import type { UserID } from "common/types";
import express, { type Request, type Response } from "express";
import { deleteMatch, getMatchesByUserId } from "../database/matches";
import { getUserId } from "../firebase/auth/db";

const router = express.Router();

// SELECT * FROM "Relationship" WHERE user in (.sender, .recv) AND status = MATCHED
router.get("/", async (req: Request, res: Response) => {
  const userId = await getUserId(req);
  const all = await getMatchesByUserId(userId);
  const matched = all.filter((relation) => relation.status === "MATCHED");
  res.status(200).json(matched);
});

// フレンドの削除
router.delete("/:opponentId", async (req: Request, res: Response) => {
  const opponentId =
    Number.parseInt(req.params.opponentId) ?? error("bad param encoding", 400);
  // 削除操作を要求しているユーザ
  const requesterId = await getUserId(req);

  await deleteMatch(requesterId, opponentId as UserID);
  res.status(204).send();
});

export default router;
