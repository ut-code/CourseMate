import { PrismaClient } from "@prisma/client";
import type { Course, CourseID, UserID } from "../common/types";
import { getCoursesByUserId } from "./courses";

const prisma = new PrismaClient();

export async function deleteEnrollment(
  userId: UserID,
  courseId: CourseID,
): Promise<Course[]> {
  await prisma.enrollment.delete({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });
  const updatedCourses = await getCoursesByUserId(userId);
  return updatedCourses;
}

/**
 * `courseId` で与えられた講義の履修を追加する。 `courseId` と同じ曜限の講義が存在する場合はその履修を削除する。
 */
export async function createEnrollment(
  courseId: CourseID,
  userId: UserID,
): Promise<Course[]> {
  // 与えられた講義の履修がすでに存在するかどうかを確認する
  const targetEnrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });
  // 与えられた講義を履修していない場合のみ、履修の追加を行う
  if (!targetEnrollment) {
    const targetCourseSlots = await prisma.slot.findMany({
      where: {
        courseId,
      },
    });
    await prisma.$transaction(async (tx) => {
      // 与えられた講義と同じ曜限の講義の履修を削除する
      await tx.enrollment.deleteMany({
        where: {
          userId,
          course: {
            slots: {
              some: {
                OR: targetCourseSlots.map(({ day, period }) => ({
                  AND: [{ day: day }, { period: period }],
                })),
              },
            },
          },
        },
      });
      if (courseId !== "") {
        // 与えられた講義の履修を追加する
        await tx.enrollment.create({
          data: {
            userId,
            courseId,
          },
        });
      }
    });
  }

  const updatedCourses = await getCoursesByUserId(userId);
  return updatedCourses;
}
