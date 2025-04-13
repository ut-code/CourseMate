import { recommend } from "@prisma/client/sql";
import type {
  Course,
  InterestSubject,
  UserID,
  UserWithCoursesAndSubjects,
} from "common/types";
import { prisma } from "../../database/client";

export async function recommendedTo(
  user: UserID,
  limit: number,
  offset: number,
): Promise<
  Array<{
    u: UserWithCoursesAndSubjects;
    count: number;
  }>
> {
  const users = await prisma.$queryRawTyped(recommend(user, limit, offset));
  console.log("🚀", users);
  return users.map((user) => {
    const { overlap: count, ...u } = user;
    return {
      count: Number(count),
      u: {
        ...u,
        interestSubjects: (u.interestSubjects ?? []) as InterestSubject[], // TODO: type
        courses: (u.courses ?? []) as Course[], // TODO: type
      },
    };
  });
}
