import { PrismaClient } from "@prisma/client";
import { CourseID, UserID } from "../common/types";

const prisma = new PrismaClient();

// 履修情報の更新
export async function updateEnrollments(userId: UserID, courseIds: CourseID[]) {
  const existingEnrollments = await prisma.enrollment.findMany({
    where: {
      userId,
    },
  });

  const existingCourseIds = existingEnrollments.map(
    (existingEnrollment) => existingEnrollment.courseId,
  );

  const courseIdsToAdd = courseIds.filter(
    (courseId) => !existingCourseIds.includes(courseId),
  );
  const courseIdsToRemove = existingCourseIds.filter(
    (courseId) => !courseIds.includes(courseId),
  );

  await prisma.$transaction([
    prisma.enrollment.deleteMany({
      where: {
        userId,
        courseId: {
          in: courseIdsToRemove,
        },
      },
    }),

    prisma.enrollment.createMany({
      data: courseIdsToAdd.map((courseId) => ({
        userId,
        courseId,
      })),
    }),
  ]);

  const updatedEnrollments = prisma.enrollment.findMany({
    where: {
      userId,
    },
  });

  return updatedEnrollments;
}
