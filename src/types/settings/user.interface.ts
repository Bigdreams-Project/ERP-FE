import { Center } from "../academic/center.interface";

export interface Batch {
  id?: string;
  code: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  duration: string;
  status: string;
}

export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  status: string;
  centers: string[];
}

export interface IUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: IUser) => void;
  initialData?: Partial<IUser>;
  mode: "add" | "edit";
  centers: Center[];
}
