import { CheckCircle } from "lucide-react";
import { MdOutlineErrorOutline } from "react-icons/md";

export const getCenterStatus = (status: string) => {
  let centerStatus;

  switch (status) {
    case "ACTIVE":
      return <CheckCircle size={16} color="#22c55e" />;
    case "IN_SETUP":
      return <MdOutlineErrorOutline size={18} color="#22c55e" />
    case "SUSPENDED":
      return <MdOutlineErrorOutline size={18} color="#22c55e" />
    case "CLOSED":
      return <MdOutlineErrorOutline size={18} color="#22c55e" />
    default:
      break;
  }

  return centerStatus;
};
