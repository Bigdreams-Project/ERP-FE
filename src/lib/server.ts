import { AuthRoutes } from "@/constants/apiRoutes.constant";
import axios from "axios";
import { getSession } from "./session";

export const server = async () => {
  const session = await getSession();
  if (!session) {
    throw new Error("No active session");
  }

  const instance = axios.create({
    baseURL: AuthRoutes.BASE_URL,
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
    withCredentials: true,
  });

  return instance;
};
