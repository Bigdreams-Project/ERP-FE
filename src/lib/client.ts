import { AuthRoutes } from "@/constants/apiRoutes.constant";
import axios from "axios";

const client = axios.create({
  baseURL: AuthRoutes.BASE_URL,
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const accessToken = sessionStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default client;
