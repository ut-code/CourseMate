import { prisma } from "../database/client";

async function main() {
  // users
  await prisma.user.upsert({
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

  await prisma.user.upsert({
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
  await prisma.user.upsert({
    where: { id: 103 },
    update: {},
    create: {
      id: 103,
      name: "小五郎",
      gender: "男",
      grade: "B3",
      faculty: "経済学部",
      department: "経営学科",
      intro: "小五郎です。",
      pictureUrl:
        "https://firebasestorage.googleapis.com/v0/b/coursemate-tutorial.appspot.com/o/45QiYkH65OWHZYPruT9sHKAHa4I3%2FulavVaTxMNACkcn4.jpg?alt=media&token=6eea4c9f-c9ec-4c6e-943b-96b0afe013c3",
      guid: "abc103",
    },
  }); // courses

  await prisma.course.upsert({
    where: { id: "10001" },
    update: {},
    create: {
      id: "10001",
      name: "国語八列",
      teacher: "足助太郎",
    },
  });
  await prisma.course.upsert({
    where: { id: "10002" },
    update: {},
    create: {
      id: "10002",
      name: "数学八列",
      teacher: "足助太郎",
    },
  });
  await prisma.course.upsert({
    where: { id: "10003" },
    update: {},
    create: {
      id: "10003",
      name: "英語八列",
      teacher: "足助太郎",
    },
  });
  await prisma.course.upsert({
    where: { id: "10004" },
    update: {},
    create: {
      id: "10004",
      name: "理科八列",
      teacher: "足助太郎",
    },
  });
  await prisma.course.upsert({
    where: { id: "10005" },
    update: {},
    create: {
      id: "10005",
      name: "社会八列",
      teacher: "足助太郎",
    },
  });

  // slot
  await prisma.slot.upsert({
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
  await prisma.slot.upsert({
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
  await prisma.slot.upsert({
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
  await prisma.slot.upsert({
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
  await prisma.slot.upsert({
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
  await prisma.slot.upsert({
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
  await prisma.slot.upsert({
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

  await prisma.slot.upsert({
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

  await prisma.slot.upsert({
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

  //                       userId, courseId
  const enrollments: Array<[number, string]> = [
    // assert: 101 and 102 has more overlaps in courses than 101 and 103, but less than 102 and 103
    // if you change the assertion above, fix test in engines/recommendation.test.ts too.
    [101, "10001"],
    [101, "10002"],
    [101, "10003"],
    [102, "10002"],
    [102, "10003"],
    [102, "10004"],
    [102, "10005"],
    [103, "10003"],
    [103, "10004"],
    [103, "10005"],
  ];

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
