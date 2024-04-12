import express from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const router = express.Router();

// C: 特定のユーザーが特定の授業を履修したら、そのデータがenrollmentテーブルに追加される
router.post('/enroll', async (req, res) => {
  const { userId, courseId } = req.body;

  try {
    // enrollmentテーブルに新しいレコードを作成する
    const enrollment = await prisma.enrollment.create({
      data: {
        user: { connect: { id: userId } },
        course: { connect: { id: courseId } }
      }
    });

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to enroll user in course.' });
  }
});

// R: 特定のユーザーがどの授業を履修しているのか参照する
router.get('/user/:userId/enrollments', async (req, res) => {
  const userId = parseInt(req.params.userId);

  try {
    // 特定のユーザーの履修情報を取得する
    const userEnrollments = await prisma.user.findUnique({
      where: { id: userId },
      include: { enrollments: true }
    });

    res.json(userEnrollments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user enrollments.' });
  }
});

// R: 特定の授業をどのユーザが履修しているのか参照する
router.get('/course/:courseId/enrollments', async (req, res) => {
  const courseId = parseInt(req.params.courseId);

  try {
    // 特定の授業の履修者情報を取得する
    const courseEnrollments = await prisma.course.findUnique({
      where: { id: courseId },
      include: { enrollments: true }
    });

    res.json(courseEnrollments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch course enrollments.' });
  }
});

// U: 特定のユーザーが履修する授業を変更したら、テーブル上のデータも変更される
router.put('/enroll/:enrollmentId', async (req, res) => {
  const enrollmentId = parseInt(req.params.enrollmentId);
  const { userId, courseId } = req.body;

  try {
    // enrollmentテーブルのレコードを更新する
    const updatedEnrollment = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: {
        user: { connect: { id: userId } },
        course: { connect: { id: courseId } }
      }
    });

    res.json(updatedEnrollment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update enrollment.' });
  }
});

// D: 特定のユーザーが履修する授業を消去したら、テーブル上のデータも消去される
router.delete('/enroll/:enrollmentId', async (req, res) => {
  const enrollmentId = parseInt(req.params.enrollmentId);

  try {
    // enrollmentテーブルからレコードを削除する
    await prisma.enrollment.delete({ where: { id: enrollmentId } });

    res.json({ message: 'Enrollment deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete enrollment.' });
  }
});

export default router;

