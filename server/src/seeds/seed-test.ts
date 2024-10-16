import { prisma } from "../database/client";
import { courses, enrollments, slots, subjects, users } from "./test-data/data";

async function main() {
  await Promise.all(
    subjects.map(async ({ group, subjects }) => {
      for (const name of subjects) {
        await prisma.interestSubject.upsert({
          where: { name_group: { name, group } },
          update: {},
          create: { name, group },
        });
      }
    }),
  );

  await Promise.all(
    users.map(async (user) => {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: user,
      });
    }),
  );

  await Promise.all(
    courses.map(async (course) => {
      await prisma.course.upsert({
        where: { id: course.id },
        update: course,
        create: course,
      });
    }),
  );

  await Promise.all(
    slots.map(async (slot) => {
      await prisma.slot.upsert({
        where: {
          courseId_period_day: {
            courseId: slot.courseId,
            period: slot.period,
            day: slot.day,
          },
        },
        update: slot,
        create: slot,
      });
    }),
  );

  const promises = enrollments.map(async ([user, course]) => {
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: { userId: user, courseId: course },
      },
      update: {},
      create: {
        userId: user,
        courseId: course,
      },
    });
  });
  await Promise.all(promises);
}

await main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
