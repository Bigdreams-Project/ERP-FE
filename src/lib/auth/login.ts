"use server";
import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { ILoginUser } from "@/types/auth/login.interface";
import axios from "axios";
import { createSession, deleteSession } from "../session";

export const loginUser = async (credentials: ILoginUser) => {
  try {
    if (!AuthRoutes.BASE_URL) {
      throw new Error("API base URL is not configured. Please check your environment variables.");
    }

    const response = await axios.post(
      `${AuthRoutes.BASE_URL}${AuthRoutes.LOGIN}`,
      credentials,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    if (response.status < 200 || response.status >= 300) {
      console.error("Login error:", response.status, response.data);
      throw new Error(`Login failed with status ${response.status}`);
    }

    const { id, email: userEmail, accessToken, refreshToken } = response.data;

    await createSession({
      user: { id, email: userEmail },
      accessToken,
      refreshToken,
    });
    return { user: { id, email: userEmail }, accessToken, refreshToken };
  } catch (error: any) {
    if (error.response) {
      const errorMessage =
        error.response.data?.message ||
        error.response.data?.error ||
        `Login failed with status ${error.response.status}`;
      console.error(
        "Login error response:",
        error.response.status,
        error.response.data
      );
      throw new Error(errorMessage);
    } else {
      console.error("Login error:", error.message);
      throw new Error("Login failed. Please try again.");
    }
  }
};

export const logoutUser = async () => {
  try {
    await deleteSession();
  } catch (error: any) {
    console.error("Logout failed:", error.response?.data || error.message);
  }
};
