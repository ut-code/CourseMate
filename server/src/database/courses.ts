import { Day, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// コースの作成
export async function createCourse(id: string, name: string) {
  return await prisma.course.create({
    data: {
      id,
      name,
    },
  });
}

// コースの取得
export async function getCourse(courseId: string) {
  return await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });
}

export async function getCoursesByDayPeriod({
  period,
  day,
}: {
  period: number;
  day: Day;
}) {
  return await prisma.courseDayPeriod.findMany({
    where: {
      period,
      day,
    },
    include: {
      course: true,
    },
  });
}

// コースの更新
export async function updateCourse({
  courseId,
  name,
}: {
  courseId: string;
  name: string;
}) {
  return await prisma.course.update({
    where: {
      id: courseId,
    },
    data: {
      name,
    },
  });
}

// コースの削除
export async function deleteCourse(courseId: string) {
  return await prisma.course.delete({
    where: {
      id: courseId,
    },
  });
}
