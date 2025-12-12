import { ProgramType } from "../academic/student.interface";

export interface CreateStudent {
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
  amount: string | null;
  lumpSumFee: string | null;
  numberOfInstallments: string | null;
  paymentPlan: string;
  paymentType: string;
  paymentMethod: string;
  notes: string;
  courseId: string;
  bankId: string;
  batchId: string | null;
  programType?: ProgramType;
}

export interface UpdateStudent {
  id: string;
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
  programType?: ProgramType;
}

export interface CreateStudentPayment {
  studentId: string;
  courseId: string;
  bankId: string;
  amount: number;
  courseFee: number;
  numberOfInstallments: number;
  paymentPlan: string;
  paymentType: string;
  paymentMethod: string;
}

export interface BulkUploadStudentPayment {
  amount: number;
  date: string;
  balance: number;
}

export interface BulkUploadStudentRecord {
  oldId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  enrolledDate: string;
  courseId: string;
  courseFee: number;
  payments: BulkUploadStudentPayment[];
  guardianName?: string;
  guardianEmail?: string | null;
  guardianPhone?: string;
  guardianAddress?: string;
}

export interface BulkUploadStudentsRequest {
  centerId: string;
  records: BulkUploadStudentRecord[];
}

export interface BulkUploadStudentsResponse {
  success: number;
  failed: number;
  skipped: number;
  errors: Array<{
    row: number;
    oldId?: string;
    email?: string;
    fullName?: string;
    error: string;
  }>;
  skippedRecords: Array<{
    row: number;
    oldId?: string;
    email?: string;
    fullName?: string;
    reason: string;
  }>;
  total: number;
}