import type { UserID } from "common/types";
import { Hono } from "hono";
import { z } from "zod";
import { deleteMatch, getMatchesByUserId } from "../database/matches";
import { getUserId } from "../firebase/auth/db";
import { param } from "../lib/validator";

const router = new Hono()

  // SELECT * FROM "Relationship" WHERE user in (.sender, .recv) AND status = MATCHED
  .get("/", async (c) => {
    const userId = await getUserId(c);
    const all = await getMatchesByUserId(userId);
    const matched = all.filter((relation) => relation.status === "MATCHED");
    return c.json(matched);
  })

  // フレンドの削除
  .delete(
    "/:opponentId",
    param({
      opponentId: z.coerce.number(),
    }),
    async (c) => {
      const opponentId = c.req.valid("param").opponentId;
      // 削除操作を要求しているユーザ
      const requesterId = await getUserId(c);

      await deleteMatch(requesterId, opponentId as UserID);
      c.status(204);
      c.text("");
    },
  );

export default router;
