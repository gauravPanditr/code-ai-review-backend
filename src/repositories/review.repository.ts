import { prisma } from "../lib/primsa.js";

export async function findReviewsByUser(userId: string) {
  return prisma.review.findMany({
    where: {
      repository: {
        userId,
      },
    },
    include: {
      repository: {
        select: {
          id: true,
          name: true,
          owner: true,
          fullName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });
}