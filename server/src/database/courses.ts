import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// コースの作成
export async function createCourse(name: string) {
  try {
    return await prisma.course.create({
      data: {
        name,
      },
    });
  } catch (error) {
    throw error;
  }
}

// コースの取得
export async function getCourse(courseId: number) {
  try {
    return await prisma.course.findUnique({
      where: {
        id: courseId,
      },
    });
  } catch (error) {
    throw error;
  }
}

// コースの更新
export async function updateCourse({ courseId, name }: { courseId: number; name: string }) {
  try {
    return await prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        name,
      },
    });
  } catch (error) {
    throw error;
  }
}

// コースの削除
export async function deleteCourse(courseId: number) {
  try {
    return await prisma.course.delete({
      where: {
        id: courseId,
      },
    });
  } catch (error) {
    throw error;
  }
}
