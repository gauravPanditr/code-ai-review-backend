
import { Octokit } from "octokit";
import { auth } from "./auth.js"
import { prisma } from "./primsa.js";

export const getGithubToken=async ()=>{
    const session=await auth.api.getSession();
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



interface ContributionData {
  user: {
    contributionCollection: {
      contributionCalendar: {
        totalContributions: number;
        weeks: {
          contributionDays: {
            contributionCount: number;
            date: string;
            color: string;
          }[];
        }[];
      };
    };
  };
}

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
        contributionCollection {
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
    const response =
      await octokit.graphql<ContributionData>(
        query,
        {
          username,
        }
      );

    return response.user.contributionCollection
      .contributionCalendar;
  } catch (error) {
    console.error(
      "Failed to fetch contributions:",
      error
    );
    throw error;
  }
}