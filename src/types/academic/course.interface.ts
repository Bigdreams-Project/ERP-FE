import { ILead } from "./lead.interface";
import { IStudent } from "./student.interface";
 
export interface Course {
  id?: string;
  code: string;
  name: string;
  type: string;
  status: string;
  duration: number;
  lumpSumFee: number;
  baseFee: number;
  students: IStudent[];
  leads: ILead[];
  maxInstallments: number;
  costPerInstallment: number | null;
  centers: string[];
}

export interface ICourse {
  id?: string;
  code: string;
  name: string;
  type: string;
  status: string;
  duration: number;
  lumpSumFee: number;
  baseFee: number;
  students: IStudent[];
  leads: ILead[];
  maxInstallments: number;
  costPerInstallment: number | null;
  centers: string[];
}

export interface ICourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (courseData: ICourse, isDraft: boolean) => void;
  initialData?: Partial<ICourse>;
  mode: "add" | "edit";
}
