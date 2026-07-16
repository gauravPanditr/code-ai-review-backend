import { auth } from "../lib/auth.js";

import { Octokit } from "octokit";
import { getGithubToken,fetchUserContribution } from "../lib/github.js";

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

