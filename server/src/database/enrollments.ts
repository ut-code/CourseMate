import { PrismaClient } from "@prisma/client";
import { CourseDayPeriod, CourseID, UserID } from "../common/types";
import {
  getCourseByDayPeriodAndUser,
  getCoursesWithDayPeriodsByUser,
} from "./courses";

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
}

// 履修情報の更新
export async function updateEnrollments(
  courseDayPeriod: CourseDayPeriod,
  userId: UserID,
) {
  const currentCourse = await getCourseByDayPeriodAndUser({
    day: courseDayPeriod.day,
    period: courseDayPeriod.period,
    userId,
  });

  const newCourseDayPeriods = await prisma.courseDayPeriod.findMany({
    where: {
      courseId: courseDayPeriod.courseId,
    },
  });

  const [a, b, c] = await prisma.$transaction([
    // delete current course if exists
    prisma.enrollment.deleteMany({
      where: {
        userId,
        courseId: currentCourse?.id ?? "",
      },
    }),

    // delete courses in the same day and period as the new course
    prisma.enrollment.deleteMany({
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
    }),

    // add new course
    prisma.enrollment.create({
      data: {
        userId,
        courseId: courseDayPeriod.courseId,
      },
    }),
  ]);
  console.log(a, b, c);

  const updatedCourses = await getCoursesWithDayPeriodsByUser(userId);

  return updatedCourses;
}
