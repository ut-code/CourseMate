import type { InterestSubject, UserID } from "common/types";
import { prisma } from "./client";

export async function all(): Promise<InterestSubject[]> {
  return await prisma.interestSubject.findMany();
}

export async function get(id: number): Promise<InterestSubject | null> {
  return await prisma.interestSubject.findUnique({ where: { id } });
}

export async function of(userId: UserID): Promise<InterestSubject[]> {
  return await prisma.interest
    .findMany({
      where: {
        userId,
      },
      select: {
        subject: true,
      },
    })
    .then((res) => res.map((interest) => interest.subject));
}

export async function add(userId: UserID, subjectId: number) {
  return await prisma.interest.create({
    data: {
      userId,
      subjectId,
    },
  });
}
export async function remove(userId: UserID, subjectId: number) {
  return await prisma.interest.delete({
    where: {
      userId_subjectId: { userId, subjectId },
    },
  });
}
