import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// コースの作成
export async function createCourse(name) {
  return await prisma.course.create({
    data: {
      name,
    },
  });
}

// コースの取得
export async function getCourse(courseId) {
  return await prisma.course.findUnique({
    where: {
      id: courseId,
    },
  });
}
