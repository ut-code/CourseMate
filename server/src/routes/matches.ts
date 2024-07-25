import express, { Request, Response } from "express";
import { deleteMatch, getMatchesByUserId } from "../database/matches";
import { Relationship, UserID } from "../../../common/types";

const router = express.Router();

// 特定のユーザIDを含むマッチの取得
router.get("/", async (req: Request, res: Response) => {
  const userId= 1; // TODO: get it from auth
  const didItFail = false;
  if (didItFail) return res.status(401).send("auth error");

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
  const opponentId = parseInt(req.params.opponentId);
  const requesterId = 1; //削除操作を要求しているユーザを指す // TODO: get requester's id from auth
  const didItFail = false;
  if (didItFail) return res.status(401).send("auth error");

  try {
    await deleteMatch(requesterId, opponentId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting match:", error);
    res.status(500).json({ error: "Failed to delete match" });
  }
});

export default router;
