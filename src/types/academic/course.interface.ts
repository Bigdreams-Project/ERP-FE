import { CreateCourse } from "../requests/course.interface";
import { Batch } from "./batch.interface";
import { Center } from "./center.interface";
import { Document, ILead } from "./lead.interface";
import { IStudent } from "./student.interface";

export interface CourseAssignment {
  id?: string;
  centerId?: string;
  center: Center;
  lumpSumFee: number;
  baseFee: number;
  maxInstallments: number;
  costPerInstallment: number;
}

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
  courseAssignments: CourseAssignment[];
  batches: Batch[];
  documents: Document[];
  paymentPlans: any[];
  deletedAt: string | null;
  createdAt?: string;
}

export interface ICourse {
  id?: string;
  name: string;
  type: string;
  duration: number;
  oldId?: string;
}

export interface ICourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CreateCourse, isDraft: boolean) => void;
  initialData?: Partial<ICourse>;
  mode: "add" | "edit";
}
