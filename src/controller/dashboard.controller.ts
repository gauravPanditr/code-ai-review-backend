
import type { Request, Response } from "express";
import { getContributionStats, getDashboardStats, getMonthlyActivity } from "../service/dashboard.service.js";

export const getDashboardController = async (
  req:Request,
  res: Response
) => {
  try {
    const dashboardData = await getDashboardStats(req);

    return res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};
export const getContributionStat = async (
  req:Request,
  res: Response
) => {
  try {
    const getContributionStat = await getContributionStats(req);

    return res.status(200).json({
      success: true,
      data: getContributionStat,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};
export const getMonthlyActivityController = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await getMonthlyActivity(req);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Monthly Activity Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch monthly activity",
    });
  }
}