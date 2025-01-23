import { recommend as sql } from "@prisma/client/sql";
import { Err, Ok, type Result } from "common/lib/result";
import type { UserID, UserWithCoursesAndSubjects } from "common/types";
import { prisma } from "../../database/client";
import { getCoursesByUserId } from "../../database/courses";
import * as interest from "../../database/interest";
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
        const { overlap: count, ...u } = res;
        if (count === null)
          throw new Error("count is null: something is wrong");
        // TODO: user の情報はここで再度 DB に問い合わせるのではなく、 recommend の sql で取得
        const user = await getUserByID(u.id);
        if (!user.ok) throw new Error("user not found");
        const courses = getCoursesByUserId(u.id);
        const subjects = interest.of(u.id);
        return {
          count: Number(count),
          u: {
            ...user.value,
            courses: await courses,
            interestSubjects: await subjects,
          },
        };
      }),
    )
      .then((val) => Ok(val))
      .catch((err) => Err(err));
  } catch (err) {
    console.error("caught error: ", err);
    return Err(500);
  }
}
