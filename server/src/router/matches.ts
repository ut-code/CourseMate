import { safeParseInt } from "common/lib/result/safeParseInt";
import type { UserID } from "common/types";
import express, { type Request, type Response } from "express";
import { deleteMatch, getMatchesByUserId } from "../database/matches";
import { safeGetUserId } from "../firebase/auth/db";

const router = express.Router();

// SELECT * FROM "Relationship" WHERE user in (.sender, .recv) AND status = MATCHED
router.get("/", async (req: Request, res: Response) => {
  const userId = await safeGetUserId(req);
  if (!userId.ok) return res.status(401).send("auth error");

  try {
    const all = await getMatchesByUserId(userId.value);
    if (!all.ok) return res.status(500).send();
    const matched = all.value.filter(
      (relation) => relation.status === "MATCHED",
    );
    res.status(200).json(matched);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

// フレンドの削除
router.delete("/:opponentId", async (req: Request, res: Response) => {
  const opponentId = safeParseInt(req.params.opponentId);
  if (!opponentId.ok) return res.status(400).send("bad param encoding");

  // 削除操作を要求しているユーザ
  const requesterId = await safeGetUserId(req);
  if (!requesterId.ok) return res.status(401).send("auth error");

  const result = await deleteMatch(
    requesterId.value,
    opponentId.value as UserID,
  );
  res.status(result.ok ? 204 : 500).send();
});

export default router;
