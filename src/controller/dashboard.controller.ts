
import type { Response } from "express";
import { getDashboardStats } from "../service/dashboard.service.js";

export const getDashboardController = async (
  
  res: Response
) => {
  try {
    const dashboardData = await getDashboardStats();

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