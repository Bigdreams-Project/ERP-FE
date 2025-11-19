import { Payment } from "../finance/payment.interface";
import { CreateStudent, UpdateStudent } from "../requests/student.interface";
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
  payments: Payment[];
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
  birthDate: string;
  centerId: string;
  guardians: Guardian[];
  courses: Course[];
  center: Center;
  enrolledDate: string;
  batches: StudentBatch[];
  notes: StudentNote[];
  payments: Payment[];
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
  amount: string | null; 
  courseFee: string | null;
  lumpSumFee: string | null;
  numberOfInstallments: string | null;
  paymentPlan: string;
  paymentType: string;
  paymentMethod: string;
  notes: string | null;
  courseId: string;
  bankId: string;
  batchId: string | null;
}

export interface IEditStudent {
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

export interface IStudentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: UpdateStudent) => void;
  student: Student;
  courses: Course[];
  centers: Center[];
  initialData?: Partial<IStudent>;
  mode: "edit";
}