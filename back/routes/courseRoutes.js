// courseRoutes.js

import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// 全てのコースの取得エンドポイント
router.get('/', async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

// 特定のコースの取得エンドポイント
router.get('/:courseId', async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(courseId) }
    });
    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ error: "Failed to fetch course" });
  }
});

// 新しいコースの作成エンドポイント
router.post('/', async (req, res) => {
  const { name } = req.body;
  try {
    const newCourse = await prisma.course.create({
      data: {
        name
      }
    });
    res.json(newCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: "Failed to create course" });
  }
});

// コースの更新エンドポイント
router.put('/:courseId', async (req, res) => {
  const { courseId } = req.params;
  const { name } = req.body;
  try {
    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(courseId) },
      data: { name }
    });
    res.json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ error: "Failed to update course" });
  }
});

// コースの削除エンドポイント
router.delete('/:courseId', async (req, res) => {
  const { courseId } = req.params;

  try {
    await prisma.course.delete({
      where: { id: parseInt(courseId) }
    });
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ error: "Failed to delete course" });
  }
});

export default router;
