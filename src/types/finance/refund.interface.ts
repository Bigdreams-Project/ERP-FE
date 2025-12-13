import { Payment } from "./payment.interface";
import { Student } from "../academic/student.interface";

export enum RefundStatus {
  REQUESTED = "REQUESTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  COMPLETED = "COMPLETED",
}

export enum RefundReason {
  STUDENT_WITHDRAWAL = "STUDENT_WITHDRAWAL",
  COURSE_CANCELLATION = "COURSE_CANCELLATION",
  PAYMENT_ERROR = "PAYMENT_ERROR",
  DUPLICATE_PAYMENT = "DUPLICATE_PAYMENT",
  SERVICE_ISSUE = "SERVICE_ISSUE",
  OTHER = "OTHER",
}

export interface RefundRequest {
  id: string;
  paymentId: string;
  payment: {
    id: string;
    amount: number;
    student: {
      id: string;
      fullname: string;
      email: string;
    };
    course: {
      id: string;
      name: string;
      code?: string;
    };
  };
  studentId: string;
  student: {
    id: string;
    fullname: string;
    email: string;
    phone?: string;
  };
  requestedBy: string; // User ID
  requester: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
  };
  amount: number;
  reason: RefundReason | string; // Accept both enum and string
  reasonDescription?: string;
  status: RefundStatus | string; // Accept both enum and string
  approvedBy?: string;
  approver?: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
  };
  approvedAt?: string;
  processedAt?: string;
  rejectionReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RefundResponse {
  data: RefundRequest[];
  total: number;
  page: number;
  limit: number;
}

export interface RefundFilters {
  status?: RefundStatus | string;
  search?: string;
  studentId?: string;
  paymentId?: string;
  page?: number;
  limit?: number;
}

export interface CreateRefundRequest {
  paymentId: string;
  amount: number;
  reason: RefundReason;
  reasonDescription?: string;
  notes?: string;
}

export interface UpdateRefundRequest {
  status?: RefundStatus;
  rejectionReason?: string;
  notes?: string;
}

export interface ApproveRefundRequest {
  refundId: string;
  notes?: string;
}

export interface RejectRefundRequest {
  refundId: string;
  rejectionReason: string;
}

