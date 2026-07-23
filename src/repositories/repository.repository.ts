import { prisma } from "../lib/primsa.js";

export function findRepositoriesByUser(userId: string) {
  return prisma.repositary.findMany({
    where: { userId },
  });
}

export function findRepositoryByGithubId(githubId: bigint) {
  return prisma.repositary.findUnique({
    where: { githubId },
  });
}

export function createRepository(data: {
  githubId: bigint;
  name: string;
  owner: string;
  fullName: string;
  url: string;
  userId: string;
}) {
  return prisma.repositary.create({ data });
}

export function getConnectedRepositoriesByUser(userId: string) {
  return prisma.repositary.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      fullName: true,
      url: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export function findRepositoryById(
  repositoryId: string,
  userId: string
) {
  return prisma.repositary.findFirst({
    where: {
      id: repositoryId,
      userId,
    },
  });
}

export function deleteRepository(repositoryId: string) {
  return prisma.repositary.delete({
    where: {
      id: repositoryId,
    },
  });
}

export function deleteAllRepositories(userId: string) {
  return prisma.repositary.deleteMany({
    where: {
      userId,
    },
  });
}