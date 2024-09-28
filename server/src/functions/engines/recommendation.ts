import { recommend as sql } from "@prisma/client/sql";
import type { UserID } from "../../common/types";
import { prisma } from "../../database/client";

export async function recommendedTo(
  user: UserID,
  limit: number,
  offset: number,
): Promise<Array<UserID>> {
  const result = await prisma.$queryRawTyped(sql(user, limit, offset));
  return result.map((res) => res.id);
}
