import express, { Request, Response } from "express";
import { deleteMatch, getMatchesByUserId } from "../database/matches";
import { Relationship } from "../../../common/types";
import { safeGetUserId } from "../firebase/auth/db";
import { safeParseInt } from "../../../common/lib/safeParseInt";

const router = express.Router();

// 特定のユーザIDを含むマッチの取得
router.get("/", async (req: Request, res: Response) => {
  const id = await safeGetUserId(req);
  if (!id.ok)
    return res.status(401).send("auth error");
  const userId = id.value;

  try {
    const all: Relationship[] = await getMatchesByUserId(userId);
    const matched = all.filter((relation) => relation.status === "MATCHED");
    res.status(200).json(matched);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

// マッチの削除
router.delete("/:opponentId", async (req: Request, res: Response) => {
  const tgt = safeParseInt(req.params.opponentId);
  if (!tgt.ok) return res.status(400).send("bad param encoding");
  const opponentId = tgt.value;

  const rqstr = await safeGetUserId(req);
  if (!rqstr.ok) return res.status(401).send("auth error");

  //削除操作を要求しているユーザを指す
  const requesterId = rqstr.value;

  try {
    await deleteMatch(requesterId, opponentId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting match:", error);
    res.status(500).json({ error: "Failed to delete match" });
  }
});

export default router;
