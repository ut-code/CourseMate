import { prisma } from "../database/client";

async function main() {
  // users
  const user1 = await prisma.user.upsert({
    where: { id: 101 },
    update: {},
    create: {
      id: 101,
      name: "田中太郎",
      gender: "男",
      grade: "D2",
      faculty: "工学部",
      department: "電気電子工学科",
      intro: "田中太郎です。",
      pictureUrl:
        "https://firebasestorage.googleapis.com/v0/b/coursemate-tutorial.appspot.com/o/YdulS1s41LVh1nWgOBqzMiXN7803%2FtP5PrelZVe6v4UoF.jpg?alt=media&token=252da169-cccb-45b3-bec6-946ec3de3e27",
      guid: "abc101",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { id: 102 },
    update: {},
    create: {
      id: 102,
      name: "山田花子",
      gender: "女",
      grade: "B2",
      faculty: "経済学部",
      department: "経営学科",
      intro: "山田花子です。",
      pictureUrl:
        "https://firebasestorage.googleapis.com/v0/b/coursemate-tutorial.appspot.com/o/45QiYkH65OWHZYPruT9sHKAHa4I3%2FulavVaTxMNACkcn4.jpg?alt=media&token=6eea4c9f-c9ec-4c6e-943b-96b0afe013c3",
      guid: "abc102",
    },
  });

  console.log({ user1, user2 });

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

  // enrollment
  const user1Enrollment1 = await prisma.enrollment.upsert({
    where: {
      userId_courseId: { userId: 101, courseId: "10001" },
    },
    update: {},
    create: {
      userId: 101,
      courseId: "10001",
    },
  });

  const user1Enrollment2 = await prisma.enrollment.upsert({
    where: {
      userId_courseId: { userId: 101, courseId: "10002" },
    },
    update: {},
    create: {
      userId: 101,
      courseId: "10002",
    },
  });

  const user2Enrollment1 = await prisma.enrollment.upsert({
    where: {
      userId_courseId: { userId: 102, courseId: "10003" },
    },
    update: {},
    create: {
      userId: 102,
      courseId: "10003",
    },
  });

  const user2Enrollment2 = await prisma.enrollment.upsert({
    where: {
      userId_courseId: { userId: 102, courseId: "10005" },
    },
    update: {},
    create: {
      userId: 102,
      courseId: "10005",
    },
  });

  console.log({
    user1Enrollment1,
    user1Enrollment2,
    user2Enrollment1,
    user2Enrollment2,
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
