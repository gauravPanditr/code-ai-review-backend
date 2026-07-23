import { prisma } from "../lib/primsa.js";

export async function findReviewsByUser(userId: string) {
  return prisma.review.findMany({
    where: {
      repository: {
        userId,
      },
    },
    include: {
      repository: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });
}