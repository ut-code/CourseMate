import * as fs from "node:fs";
import * as path from "node:path";

import { prisma } from "../database/client";

// シ楽バス形式のデータを読み込む。
const FILE_PATH = path.join(__dirname, "data.json");

async function main() {
  const jsonData = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));

  const coursesData = jsonData.map(
    (course: {
      code: string;
      titleJp: string;
      lecturerJp: string;
    }) => {
      const { code, titleJp, lecturerJp } = course;
      return {
        id: code,
        name: titleJp,
        teacher: lecturerJp,
      };
    },
  );

  await prisma.course.createMany({
    data: coursesData,
  });

  const slotsData: {
    day: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun" | "other";
    period: number;
    courseId: string;
  }[] = [];

  for (const courseData of jsonData) {
    const { code, periods } = courseData;

    for (const period of periods) {
      const [dayJp, periodStr] = period.split("");
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
        period: Number.parseInt(periodStr) || 0,
        courseId: code,
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
