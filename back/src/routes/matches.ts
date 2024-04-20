import express, { Request, Response } from "express";
import { deleteMatch, getMatchesByUserId } from "../helpers/matchHelper";

const router = express.Router();

// 特定のユーザIDを含むマッチの取得
router.get("/", async (req: Request, res: Response) => {
  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }
  try {
    const matches = await getMatchesByUserId(parseInt(userId as string));
    res.status(200).json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
});

// マッチの削除
router.delete("/:relationshipId", async (req: Request, res: Response) => {
  const { relationshipId } = req.params;
  try {
    await deleteMatch(parseInt(relationshipId));
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting match:", error);
    res.status(500).json({ error: "Failed to delete match" });
  }
});

export default router;
