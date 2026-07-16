import { auth } from "../lib/auth.js";

import { Octokit } from "octokit";
import { getGithubToken,fetchUserContribution } from "../lib/github.js";
import { logger } from "better-auth";

export async function getDashboardStats() {
  try {
    const session = await auth.api.getSession();

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const token = await getGithubToken();

    const octokit = new Octokit({
      auth: token,
    });

    // Get authenticated github user
    const { data: user } =
      await octokit.rest.users.getAuthenticated();

    // Total Repositories
    const { data: repos } =
      await octokit.rest.repos.listForAuthenticatedUser({
        per_page: 100,
      });

    const totalRepos = repos.length;

    // Total Commits
    const calendar =
      await fetchUserContribution(
        token,
        user.login
      );

    const totalCommits =
      calendar?.totalContributions || 0;

    // Total Pull Requests
    const { data: prs } =
      await octokit.rest.search.issuesAndPullRequests({
        q: `author:${user.login} type:pr`,
        per_page: 1,
      });

    const totalPRs = prs.total_count;

    // Placeholder
    const totalReviews = 0;

    return {
      user: {
        login: user.login,
        name: user.name,
        avatar: user.avatar_url,
      },
      stats: {
        totalRepos,
        totalCommits,
        totalPRs,
        totalReviews,
      },
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}



export async function getMonthlyActivity() {
  try {
    const session = await auth.api.getSession();

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const token = await getGithubToken();

    const octokit = new Octokit({
      auth: token,
    });

    const { data: user } = await octokit.rest.users.getAuthenticated();
    const calendar = await fetchUserContribution(token, user.login);

    if (!calendar) return [];

    const monthlyData: {
      [key: string]: { commits: number; prs: number; reviews: number };
    } = {};

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey: any = monthNames[date.getMonth()];
      monthlyData[monthKey] = { commits: 0, prs: 0, reviews: 0 };
    }

    calendar.weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        const date = new Date(day.date);
        const monthKey: any = monthNames[date.getMonth()];

        if (monthlyData[monthKey]) {
          monthlyData[monthKey].commits += day.contributionCount;
        }
      });
    });

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const reviews = generateSampleReviews();
    reviews.forEach((review) => {
      const monthKey :any= monthNames[review.createdAt.getMonth()];
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].reviews += 1;
      }
    });

    const { data: prs } = await octokit.rest.search.issuesAndPullRequests({
      q: `author:${user.login} type:pr created:>${
        sixMonthsAgo.toISOString().split("T")[0]
      }`,
      per_page: 100,
    });

    prs.items.forEach((pr: any) => {
      const date = new Date(pr.created_at);
      const monthKey:any = monthNames[date.getMonth()];
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].prs += 1;
      }
    });

    return Object.keys(monthlyData).map((name) => ({
      name,
      ...monthlyData[name],
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}

function generateSampleReviews() {
  const sampleReviews = [];
  const now = new Date();

  // Generate random reviews over the past 6 months
  for (let i = 0; i < 45; i++) {
    const randomDaysAgo = Math.floor(Math.random() * 180);
    const reviewDate = new Date(now);
    reviewDate.setDate(reviewDate.getDate() - randomDaysAgo);

    sampleReviews.push({
      createdAt: reviewDate,
    });
  }

  return sampleReviews;
}
