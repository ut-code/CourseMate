import * as fs from "node:fs";
import * as path from "node:path";

import { prisma } from "../database/client";

// 後期 (scraper) 形式のデータを読み込む。
const FILE_PATH = path.join(__dirname, "data.json");

// sample
// [
//   {
//     name: "zenki",
//     courses: [
//       {
//         name: "数理科学基礎",
//         teacher: "(人名)",
//         semester: "S1,S2",
//         period: "月曜2限、水曜1限",
//         code: "30003 CAS-FC1871L1",
//       },
//     ],
//   },
// ];

async function main() {
  const jsonData: {
    courses: {
      name: string;
      teacher: string;
      semester: string;
      period: string;
      code: string;
    }[];
  }[] = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
  console.log(jsonData);

  const coursesData = jsonData[0].courses
    .filter((course) => course.semester.split("")[0] === "S")
    .map((course) => {
      const { code, name, teacher } = course;
      return {
        id: code.split(" ")[0],
        name: name,
        teacher: teacher,
      };
    });

  await prisma.course.createMany({
    data: coursesData,
  });

  const slotsData: {
    day: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun" | "other";
    period: number;
    courseId: string;
  }[] = [];

  for (const courseData of jsonData[0].courses) {
    const { code, period } = courseData;

    if (courseData.semester.split("")[0] !== "S") continue;

    for (const p of period.split("、")) {
      const [dayJp, periodStr] = p.split("曜");
      const day =
        dayJp === "月"
          ? "mon"
          : dayJp === "火"
            ? "tue"
            : dayJp === "水"
              ? "wed"
              : dayJp === "木"
                ? "thu"
                : dayJp === "金"
                  ? "fri"
                  : dayJp === "土"
                    ? "sat"
                    : dayJp === "日"
                      ? "sun"
                      : "other";

      slotsData.push({
        day,
        period: Number.parseInt(periodStr?.split("")[0]) || 0,
        courseId: code.split(" ")[0],
      });
    }
  }

  await prisma.slot.createMany({
    data: slotsData,
    skipDuplicates: true,
  });

  console.log("Data inserted successfully!");
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
