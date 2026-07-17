import type{ Request, Response } from "express";

export const githubWebhookController = async (
  req: Request,
  res: Response
) => {
  try {
    console.log("HEADERS:", req.headers);
  console.log("BODY:", req.body);

    const event = req.headers["x-github-event"];

    console.log("Webhook Event:", event);
    console.log("Payload:", req.body);

    if (event === "ping") {
      return res.status(200).json({
        message: "Pong",
      });
    }

    if (event === "pull_request") {
      const action = req.body.action;

      console.log("PR Action:", action);

      return res.status(200).json({
        success: true,
        message: "Pull Request Event Received",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event Processed",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};