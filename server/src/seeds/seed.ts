import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  // courses
  const course1 = await prisma.course.upsert({
    where: { id: "10001" },
    update: {},
    create: {
      id: "10001",
      name: "国語八列",
    },
  });
  const course2 = await prisma.course.upsert({
    where: { id: "10002" },
    update: {},
    create: {
      id: "10002",
      name: "数学八列",
    },
  });
  const course3 = await prisma.course.upsert({
    where: { id: "10003" },
    update: {},
    create: {
      id: "10003",
      name: "英語八列",
    },
  });
  const course4 = await prisma.course.upsert({
    where: { id: "10004" },
    update: {},
    create: {
      id: "10004",
      name: "理科八列",
    },
  });
  const course5 = await prisma.course.upsert({
    where: { id: "10005" },
    update: {},
    create: {
      id: "10005",
      name: "社会八列",
    },
  });
  console.log({ course1, course2, course3, course4, course5 });

  // slot
  const course1Slot1 = await prisma.slot.upsert({
    where: {
      courseId_period_day: { courseId: "10001", period: 4, day: "tue" },
    },
    update: {},
    create: {
      courseId: "10001",
      day: "tue",
      period: 4,
    },
  });
  const course1Slot2 = await prisma.slot.upsert({
    where: {
      courseId_period_day: { courseId: "10001", period: 4, day: "thu" },
    },
    update: {},
    create: {
      courseId: "10001",
      day: "thu",
      period: 4,
    },
  });
  const course2Slot1 = await prisma.slot.upsert({
    where: {
      courseId_period_day: { courseId: "10002", period: 3, day: "mon" },
    },
    update: {},
    create: {
      courseId: "10002",
      day: "mon",
      period: 3,
    },
  });
  const course3Slot1 = await prisma.slot.upsert({
    where: {
      courseId_period_day: { courseId: "10003", period: 3, day: "mon" },
    },
    update: {},
    create: {
      courseId: "10003",
      day: "mon",
      period: 3,
    },
  });
  const course3Slot2 = await prisma.slot.upsert({
    where: {
      courseId_period_day: { courseId: "10003", period: 3, day: "wed" },
    },
    update: {},
    create: {
      courseId: "10003",
      day: "wed",
      period: 3,
    },
  });
  const course4Slot1 = await prisma.slot.upsert({
    where: {
      courseId_period_day: { courseId: "10004", period: 3, day: "wed" },
    },
    update: {},
    create: {
      courseId: "10004",
      day: "wed",
      period: 3,
    },
  });
  const course4Slot2 = await prisma.slot.upsert({
    where: {
      courseId_period_day: { courseId: "10004", period: 3, day: "fri" },
    },
    update: {},
    create: {
      courseId: "10004",
      day: "fri",
      period: 3,
    },
  });

  const course5Slot1 = await prisma.slot.upsert({
    where: {
      courseId_period_day: { courseId: "10005", period: 2, day: "tue" },
    },
    update: {},
    create: {
      courseId: "10005",
      day: "tue",
      period: 2,
    },
  });

  const course5Slot2 = await prisma.slot.upsert({
    where: {
      courseId_period_day: { courseId: "10005", period: 3, day: "tue" },
    },
    update: {},
    create: {
      courseId: "10005",
      day: "tue",
      period: 3,
    },
  });

  console.log({
    course1Slot1,
    course1Slot2,
    course2Slot1,
    course3Slot1,
    course3Slot2,
    course4Slot1,
    course4Slot2,
    course5Slot1,
    course5Slot2,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
