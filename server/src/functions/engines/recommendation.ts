import { recommend as sql } from "@prisma/client/sql";
import { Err, Ok, type Result } from "common/lib/result";
import type { UserID, UserWithCoursesAndSubjects } from "common/types";
import { prisma } from "../../database/client";
import { getUserByID } from "../../database/users";

export async function recommendedTo(
  user: UserID,
  limit: number,
  offset: number,
): Promise<
  Result<
    Array<{
      u: UserWithCoursesAndSubjects;
      count: number;
    }>
  >
> {
  try {
    const result = await prisma.$queryRawTyped(sql(user, limit, offset));
    return Promise.all(
      result.map(async (res) => {
        const user = await getUserByID(res.id);
        if (!user.ok) throw new Error("not found"); // this shouldn't happen
        return {
          count: Number.parseInt(res.overlap?.toString() ?? "0"),
          u: user.value,
        };
      }),
    )
      .then((val) => Ok(val))
      .catch((err) => Err(err));
  } catch (err) {
    return Err(err);
  }
}
