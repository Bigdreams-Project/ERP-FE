import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { IRegisterUser } from "@/types/auth/signup.interface";
import axios from "axios";

export const registerUser = async (credentials: IRegisterUser) => {
  const res = await axios.post(
    `${AuthRoutes.BASE_URL}${AuthRoutes.SIGNUP}`,
    credentials
  );
  return res.data;
};
