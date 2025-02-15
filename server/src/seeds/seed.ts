import { prisma } from "../database/client";
import { subjects } from "./data/subjects";

for (const subjectGroup of subjects) {
  const group = subjectGroup.group;
  for (const name of subjectGroup.subjects) {
    await prisma.interestSubject.upsert({
      where: {
        name_group: { name, group },
      },
      update: { name, group },
      create: { name, group },
    });
  }
}
