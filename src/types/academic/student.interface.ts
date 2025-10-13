import { CreateStudent } from "../requests/student.interface";
import { StudentBatch } from "./batch.interface";
import { Center } from "./center.interface";
import { Course } from "./course.interface";
import { Lead } from "./lead.interface";

export interface Guardian {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  address: string;
  studentId: string;
}

export interface BatchStudent {
  id: string;
  studentId: string | null;
  leadId: string | null;
  fullName: string;
  phone: string;
  email: string;
  image: string;
  address: string;
  guardians: Guardian[];
  courses: Course[];
  enrolledDate: string;
  batches: StudentBatch[];
  status: string;
  paymentPlan: string;
  lumpSum: number | null;
  numberOfInstallments: number | null;
  comments: string | null;
  payments: any[];
  createdAt: string;
}

export interface StudentNote {
  id: string;
  title: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  studentId: string | null;
  leadId: string | null;
  fullName: string;
  phone: string;
  email: string;
  image: string; 
  address: string;
  guardians: Guardian[];
  courses: Course[];
  enrolledDate: string;
  batches: StudentBatch[];
  notes: StudentNote[];
  status: string;
  paymentPlan: string;
  lumpSum: number | null;
  numberOfInstallments: number | null;
  comments: string | null;
  createdAt: string;
}

export interface IStudent {
  leadId: string | null;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  centerId: string;
  enrolledDate: string;
  birthDate: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string | null;
  guardianAddress: string;
  courseFee: string | null;
  lumpSumFee: string | null;
  numberOfInstallments: string | null;
  paymentPlan: string;
  notes: string;
  courseId: string;
  batchId: string | null;
}

export interface IStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CreateStudent) => void;
  courses: Course[];
  centers: Center[];
  leads: Lead[];
  initialData?: Partial<IStudent>;
  mode: "enroll";
}
