import type { Request,Response } from "express";
import { connectRepository, getRepositorie } from "../service/repositories.service.js";

export const getRepositoriesController = async (req: Request, res: Response) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const perPage = req.query.perPage ? Number(req.query.perPage) : 10;

    if (Number.isNaN(page) || Number.isNaN(perPage)) {
      return res.status(400).json({
        success: false,
        message: "page and perPage must be valid numbers",
      });
    }

    const repositories = await getRepositorie( page, perPage,req);

    return res.status(200).json({
      success: true,
      data: repositories,
    });
  } catch (error: any) {
    console.error("Get Repositories Error:", error);

    if (error.message === "Unauthorized") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch repositories",
    });
  }
};


export const connectRepositoryController = async (req: Request, res: Response) => {
  try {
    const { owner, repo, githubId } = req.body;

    if (!owner || !repo || !githubId) {
      return res.status(400).json({
        success: false,
        message: "owner, repo, and githubId are required",
      });
    }

    const webhook = await connectRepository(req, owner, repo, Number(githubId));

    if (!webhook) {
      return res.status(500).json({
        success: false,
        message: "Failed to create webhook for this repository",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Repository connected successfully",
      data: webhook,
    });
  } catch (error: any) {
    console.error("Connect Repository Error:", error);

    if (error.message === "Unauthorized") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

 

    return res.status(500).json({
      success: false,
      message: "Failed to connect repository",
    });
  }
};