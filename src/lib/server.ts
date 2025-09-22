import { AuthRoutes } from "@/constants/apiRoutes.constant";
import axios from "axios";
import { getSession } from "./session";

export class NoSessionError extends Error {
  constructor() {
    super("No active session");
    this.name = "NoSessionError";
  }
}

export const server = async () => {
  const session = await getSession();
  if (!session) {
    throw new NoSessionError();
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
