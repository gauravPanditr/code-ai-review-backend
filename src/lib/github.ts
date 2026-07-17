
import { Octokit } from "octokit";
import { auth } from "./auth.js"
import { prisma } from "./primsa.js";
import { fromNodeHeaders } from "better-auth/node";
import type { Request } from "express";
export const getGithubToken=async (  req: Request)=>{
    const session=await auth.api.getSession({
      headers:fromNodeHeaders(req.headers),
    });
    if(!session){
         throw new Error("");
    }
    const account=await prisma.account.findFirst({
        where:{
            userId:session.user.id,
            providerId:"github"

        }
    })

    if(!account?.accessToken){
     throw new Error("No github")
    }
    return account?.accessToken;
}



// interface ContributionData {
//   user: {
//     contributionCollection: {
//       contributionCalendar: {
//         totalContributions: number;
//         weeks: {
//           contributionDays: {
//             contributionCount: number;
//             date: string;
//             color: string;
//           }[];
//         }[];
//       };
//     };
//   };
// }

export async function fetchUserContribution(
  token: string,
  username: string
) {
  const octokit = new Octokit({
    auth: token,
  });

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
                color
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response: any = await octokit.graphql(query, {
      username,
    });

    return response.user.contributionsCollection.contributionCalendar;
  } catch (error) {
    console.error("Failed to fetch contributions:", error);
    throw error;
  }
}

export const getRepositories=async(req:Request, page:number=1,perPage:number=10)=>{
  const token=await getGithubToken(req);
  const octokit=new Octokit({auth:token});
  const {data}=await octokit.rest.repos.listForAuthenticatedUser({
    sort:"updated",
    direction:"desc",
    visibility:"all",
    per_page:perPage,
    page:page

  })
  return data;

}

export const createWebhook=async(req:Request,owner:string,repo:string)=>{
  const token=await getGithubToken(req);
  const octokit=new Octokit({auth:token});
  const webhookUrl=`${process.env.PUBLIC_App_URL}/api/webhooks/github`
  const{data:hooks}=await octokit.rest.repos.listWebhooks({
    owner,
    repo
  })
  const existingHook=hooks.find(hook=>hook.config.url===webhookUrl)
  if(existingHook)
    return existingHook;
  const {data}=await octokit.rest.repos.createWebhook({
    owner,
    repo,
    config:{
      url:webhookUrl,
      content_type:"json"
    },
    events:["pull_request"]
  })
  return data;
}