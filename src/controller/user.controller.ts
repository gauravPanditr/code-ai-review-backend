import type { Request, Response } from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../service/user.service.js";

export const getUserProfileController = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await getUserProfile(req);
    
    
    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch profile",
    });
  }
};

export const updateUserProfileController = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email } = req.body;

    const user = await updateUserProfile(
      {
        name,
        email,
      },
      req
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update profile",
    });
  }
};