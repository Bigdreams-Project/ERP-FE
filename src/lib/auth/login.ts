"use server";
import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { ILoginUser } from "@/types/auth/login.interface";
import axios from "axios";
import { createSession, deleteSession } from "../session";

export const loginUser = async (credentials: ILoginUser) => {
  try {
    const response = await axios.post(
      `${AuthRoutes.BASE_URL}${AuthRoutes.LOGIN}`,
      credentials
    );

    if (response.status < 200 || response.status >= 300) {
      console.error("Login error:", response.status, response.data);
      throw new Error(`Login failed with status ${response.status}`);
    }

    const { id, email: userEmail, accessToken, refreshToken } = response.data;

    await createSession({
      user: { id, email: userEmail || credentials.email },
      accessToken,
      refreshToken,
    });
    return { user: { id, email: userEmail || credentials.email }, accessToken, refreshToken };
  } catch (error: any) {
    if (error.response) {
      console.error(
        "Login error response:",
        error.response.status,
        error.response.data
      );
      throw new Error(`Login failed with status ${error.response.status}`);
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
