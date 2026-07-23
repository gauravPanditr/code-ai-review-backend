import type { Request } from "express";
import { auth } from "../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";

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
  page: number = 1,
  perPage: number = 10,
  req: Request
) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const githubRepos = await getRepositories(
    req,
    page,
    perPage
  );

  const dbRepos = await findRepositoriesByUser(
    session.user.id
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
  req: Request,
  owner: string,
  repo: string,
  githubId: number
) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const webhook = await createWebhook(
    req,
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
        userId: session.user.id,
      });
    }

    try {
      await inngest.send({
        name: "repository.connected",
        data: {
          owner,
          repo,
          userId: session.user.id,
        },
      });
    } catch (error) {
      console.log("Error:", error);
    }
  }

  return webhook;
};

export async function getConnectedRepositories(
  req: Request
) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return getConnectedRepositoriesByUser(
    session.user.id
  );
}

export async function disConnectRepo(
  req: Request,
  repositoryId: string
) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const repository = await findRepositoryById(
    repositoryId,
    session.user.id
  );

  if (!repository) {
    throw new Error("Repository not found");
  }

  await deleteWebhok(
    req,
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
  req: Request
) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const repositories =
    await findRepositoriesByUser(
      session.user.id
    );

  await Promise.all(
    repositories.map((repo) =>
      deleteWebhok(
        req,
        repo.owner,
        repo.name
      )
    )
  );

  await deleteAllRepositories(
    session.user.id
  );

  return {
    success: true,
    message:
      "All repositories disconnected",
  };
}