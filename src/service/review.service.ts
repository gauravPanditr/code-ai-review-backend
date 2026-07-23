import type { Request } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";

import { findReviewsByUser } from "../repositories/review.repository.js";

export async function getReviews(req: Request) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return findReviewsByUser(session.user.id);
}