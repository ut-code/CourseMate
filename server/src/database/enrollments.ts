import { PrismaClient } from "@prisma/client";
import { CourseID, UserID } from "../common/types";
import { getCoursesWithDayPeriodsByUser } from "./courses";

const prisma = new PrismaClient();

// 履修の作成
export async function createEnrollment({
  userId,
  courseId,
}: {
  userId: UserID;
  courseId: CourseID;
}) {
  await prisma.enrollment.create({
    data: {
      userId,
      courseId,
    },
  });
}

// 履修の削除
export async function deleteEnrollment({
  userId,
  courseId,
}: {
  userId: UserID;
  courseId: CourseID;
}) {
  await prisma.enrollment.delete({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
  });
  const updatedCourses = await getCoursesWithDayPeriodsByUser(userId);
  return updatedCourses;
}

// 履修情報の更新
export async function updateEnrollments({
  userId,
  courseId,
}: {
  userId: UserID;
  courseId: CourseID;
}) {
  const newCourseDayPeriods = await prisma.courseDayPeriod.findMany({
    where: {
      courseId,
    },
  });
  await prisma.$transaction(async (tx) => {
    // delete current course if exists
    await tx.enrollment.deleteMany({
      where: {
        userId,
        courseId,
      },
    });
    // delete courses in the same day and period as the new course
    await tx.enrollment.deleteMany({
      where: {
        userId,
        course: {
          courseDayPeriods: {
            some: {
              OR: newCourseDayPeriods.map(({ day, period }) => ({
                AND: [{ day: day }, { period: period }],
              })),
            },
          },
        },
      },
    });
    if (courseId !== "") {
      // add current course
      await tx.enrollment.create({
        data: {
          userId,
          courseId,
        },
      });
    }
  });

  const updatedCourses = await getCoursesWithDayPeriodsByUser(userId);

  return updatedCourses;
}
