import type { Request } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { prisma } from "../lib/primsa.js";
import { getRepositories } from "../lib/github.js";

export const getRepositorie=async(page:number=1,perPage:number=10,req:Request)=>{
   const session = await auth.api.getSession({
      headers:fromNodeHeaders(req.headers)
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const githubRepos=await getRepositories(req,page,perPage);

    const dbRepos=await prisma.repositary.findMany({
        where:{
            userId:session.user.id,

        }
    });
  const connectedRepoIds = new Set(dbRepos.map((repo) => repo.githubId)); 

return githubRepos.map((repo: any) => ({
  ...repo,
  isConnected: connectedRepoIds.has(BigInt(repo.id)),
}));
}