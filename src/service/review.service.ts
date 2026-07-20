import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
import type { Request } from "express";
import { prisma } from "../lib/primsa.js";

export async function getReviews(req:Request) {
    const session = await auth.api.getSession({
      headers:fromNodeHeaders(req.headers)
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }
const review=await prisma.review.findMany({
    where:{
        repository:{
            userId:session.user.id
        }
    },
    include:{
        repository:true
    },
    orderBy:{
        createdAt:"desc"
    },
    take:50
})
 return review;

}