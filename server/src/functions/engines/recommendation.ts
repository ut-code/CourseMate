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
      overlap: number;
    }>
  >
> {
  try {
    const result = await prisma.$queryRawTyped(sql(user, limit, offset));
    return Promise.all(
      result.map(async (res) => {
        if (!res) throw new Error("res is null: something is wrong");
        const { overlap: count, ...u } = res;
        return { count, u };
      }),
    )
      .then((val) => Ok(val))
      .catch((err) => Err(err));
  } catch (err) {
    console.error("caught error: ", err);
    return Err(500);
  }
}
