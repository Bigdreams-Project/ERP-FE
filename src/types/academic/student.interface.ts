import { StudentBatch } from "./batch.interface";
import { Course } from "./course.interface";

export interface Guardian {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  address: string;
  studentId: string;
}

export interface BatchStudent {
  student: {
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
    createdAt: string;
  };
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
  id?: string;
  studentId: string | null;
  leadId: string | null;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  parentGuardianName: string;
  parentGuardianPhone: string;
  parentGuardianEmail: string | null;
  courseEnrolled: string;
  dateEnrolled: string;
  batch: string;
  status: string;
  paymentPlan: string;
  lumpSum: number | null;
  numberOfInstallments: number | null;
  comments: string | null;
}

export interface IStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: IStudent) => void;
  initialData?: Partial<IStudent>;
  mode: "enroll";
}
