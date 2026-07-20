import type { Request } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import { prisma } from "../lib/primsa.js";
import { createWebhook, deleteWebhok, getRepositories } from "../lib/github.js";
import { inngest } from "../inngest/client.js";

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

export const  connectRepository=async(req:Request,owner:string,repo:string,githubId:number)=>{
  const session = await auth.api.getSession({
      headers:fromNodeHeaders(req.headers)
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const webhook=await createWebhook(req,owner,repo);

if (webhook) {
  const existingRepo = await prisma.repositary.findUnique({
    where: {
      githubId: BigInt(githubId),
    },
  });

   if (!existingRepo) {
    await prisma.repositary.create({
      data: {
        githubId: BigInt(githubId),
        name: repo,
        owner,
        fullName: `${owner}/${repo}`,
        url: `https://github.com/${owner}/${repo}`,
        userId: session.user.id,
      },
    });
  }
 try {
  await inngest.send({
    name:"repository.connected",
    data:{
      owner,
      repo,
      userId:session.user.id
    }
  })
 } catch (error) {
    console.log("Error ",error);
    
 }

}
return webhook;

}
export async function getConnectedRepositories(req:Request) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    })

    if (!session?.user) {
      throw new Error("Unauthorized")
    }

    const repositories = await prisma.repositary.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        name: true,
        fullName: true,
        url: true,
        createdAt: true
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    return repositories;
    } catch (error) {
    console.error("Failed to fetch repositories:", error)
    throw new Error("Failed to fetch connected repositories")
  }
}


export async function disConnectRepo(req: Request,repositoryId:string) {
  try {

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers)
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }



    const repository = await prisma.repositary.findFirst({
      where: {
        id: repositoryId,
        userId: session.user.id
      }
    });

    if (!repository) {
      throw new Error("Repository not found");
    }

    await deleteWebhok(
      req,
      repository.owner,
      repository.name
    );

    await prisma.repositary.delete({
      where: {
        id:repositoryId,
        userId:session.user.id
      }
    });

    return {
      success: true,
      message: "Repository disconnected successfully"
    };

  } catch (error) {
    console.error(error);
    throw error;
  }
}