import { prisma } from "../database/client";
import data from "./data/interestSubjects";

const promises: Array<Promise<unknown>> = [];
for (const subjectGroup of data) {
  const group = subjectGroup.group;
  for (const name of subjectGroup.subjects) {
    promises.push(
      prisma.interestSubject.upsert({
        where: {
          name_group: { name, group },
        },
        update: { name, group },
        create: { name, group },
      }),
    );
  }
}
