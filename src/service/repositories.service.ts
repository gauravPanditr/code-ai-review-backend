

import {
  createWebhook,
  deleteWebhok,
  getRepositories,
} from "../lib/github.js";

import { inngest } from "../inngest/client.js";

import {
  findRepositoriesByUser,
  findRepositoryByGithubId,
  createRepository,
  getConnectedRepositoriesByUser,
  findRepositoryById,
  deleteRepository,
  deleteAllRepositories,
} from "../repositories/repository.repository.js";

export const getRepositorie = async (
   userId:string,
  page: number = 1,
  perPage: number = 10,
 ) => {
 

  const githubRepos = await getRepositories(
    userId,
    page,
    perPage
  );

  const dbRepos = await findRepositoriesByUser(
    userId
  );

  const connectedRepoIds = new Set(
    dbRepos.map((repo) => repo.githubId)
  );

  return githubRepos.map((repo: any) => ({
    ...repo,
    isConnected: connectedRepoIds.has(
      BigInt(repo.id)
    ),
  }));
};

export const connectRepository = async (
  userId:string,
  owner: string,
  repo: string,
  githubId: number
) => {
 

  const webhook = await createWebhook(
    userId,
    owner,
    repo
  );

  if (webhook) {
    const existingRepo =
      await findRepositoryByGithubId(
        BigInt(githubId)
      );

    if (!existingRepo) {
      await createRepository({
        githubId: BigInt(githubId),
        name: repo,
        owner,
        fullName: `${owner}/${repo}`,
        url: `https://github.com/${owner}/${repo}`,
        userId,
      });
    }

    try {
      await inngest.send({
        name: "repository.connected",
        data: {
          owner,
          repo,
          userId,
        },
      });
    } catch (error) {
      console.log("Error:", error);
    }
  }

  return webhook;
};

export async function getConnectedRepositories(
  userId:string
) {
 

  return getConnectedRepositoriesByUser(
  userId
  );
}

export async function disConnectRepo(
  userId:string,
  repositoryId: string
) {
 

  const repository = await findRepositoryById(
    repositoryId,
    userId
  );

  if (!repository) {
    throw new Error("Repository not found");
  }

  await deleteWebhok(
    userId,
    repository.owner,
    repository.name
  );

  await deleteRepository(repositoryId);

  return {
    success: true,
    message:
      "Repository disconnected successfully",
  };
}

export async function disconnectAllRepos(
  userId:string
) {
  

  const repositories =
    await findRepositoriesByUser(
      userId
    );

  await Promise.all(
    repositories.map((repo) =>
      deleteWebhok(
        userId,
        repo.owner,
        repo.name
      )
    )
  );

  await deleteAllRepositories(
    userId
  );

  return {
    success: true,
    message:
      "All repositories disconnected",
  };
}