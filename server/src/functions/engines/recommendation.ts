import { recommend } from "@prisma/client/sql";
import type { UserID } from "../../common/types";
import { prisma } from "../../database/client";

export async function recommendedTo(user: UserID): Array<UserID> {
  const x = recommend();
}
