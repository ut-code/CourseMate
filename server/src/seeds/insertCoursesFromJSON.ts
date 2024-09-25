import * as fs from "node:fs";
import * as path from "node:path";

import { prisma } from "../database/client";

// シ楽バス形式のデータを読み込む。
const FILE_PATH = path.join(__dirname, "data.json");

async function main() {
  const jsonData = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));

  for (const courseData of jsonData) {
    const { code, titleJp, lecturerJp, periods } = courseData;

    const newCourse = await prisma.course.create({
      data: {
        id: code,
        name: titleJp,
        teacher: lecturerJp,
      },
    });

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
      await prisma.slot.create({
        data: {
          day,
          period: Number.parseInt(periodStr) || 0,
          course: {
            connect: {
              id: newCourse.id,
            },
          },
        },
      });
    }
    console.log(newCourse);
  }
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
