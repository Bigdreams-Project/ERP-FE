import { CreateCourse } from "../requests/course.interface";
import { Batch } from "./batch.interface";
import { Document, ILead } from "./lead.interface";
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
  batches: Batch[];
  documents: Document[];
  createdAt?: string;
}

export interface ICourse {
  id?: string;
  name: string;
  type: string;
  duration: number;
}

export interface ICourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CreateCourse, isDraft: boolean) => void;
  initialData?: Partial<ICourse>;
  mode: "add" | "edit";
}
