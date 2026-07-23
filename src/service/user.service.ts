import {
  findUserByEmail,
  findUserById,
  updateUser,
} from "../repositories/user.repository.js";

export async function getUserProfile(
  userId: string
) {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    email?: string;
  }
) {
  if (data.email) {
    const existingUser = await findUserByEmail(
      data.email,
      userId
    );

    if (existingUser) {
      throw new Error("Email already in use");
    }
  }

  return updateUser(userId, data);
}