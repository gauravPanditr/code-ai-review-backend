import type { Request } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { prisma } from "../lib/primsa.js";

export async function getUserProfile(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Get Profile Error:", error);
    throw error;
  }
}

export async function updateUserProfile(
  data: {
    name?: string;
    email?: string;
  },
  req: Request
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    if (data.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: data.email,
          NOT: {
            id: session.user.id,
          },
        },
      });

      if (existingUser) {
        throw new Error("Email already in use");
      }
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Update Profile Error:", error);
    throw error;
  }
}