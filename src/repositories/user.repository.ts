import { prisma } from "../lib/primsa.js";

export async function findUserById(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
    },
  });
}

export async function findUserByEmail(
  email: string,
  userId: string
) {
  return prisma.user.findFirst({
    where: {
      email,
      NOT: {
        id: userId,
      },
    },
  });
}

export async function updateUser(
  userId: string,
  data: {
    name?: string;
    email?: string;
  }
) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
    },
  });
}