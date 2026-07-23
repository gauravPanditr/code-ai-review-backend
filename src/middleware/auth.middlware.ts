import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    (req as any).user = session.user;

    next();
  } catch (error) {
    next(error);
  }
}