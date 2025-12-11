import { Payment } from "./payment.interface";
import { Student } from "../academic/student.interface";

export enum RefundStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  PROCESSED = "processed",
  CANCELLED = "cancelled",
}

export enum RefundReason {
  STUDENT_WITHDRAWAL = "student_withdrawal",
  COURSE_CANCELLATION = "course_cancellation",
  PAYMENT_ERROR = "payment_error",
  DUPLICATE_PAYMENT = "duplicate_payment",
  SERVICE_ISSUE = "service_issue",
  OTHER = "other",
}

export interface RefundRequest {
  id: string;
  paymentId: string;
  payment: Payment;
  studentId: string;
  student: Student;
  requestedBy: string; // User ID
  requestedByName?: string; // User full name
  amount: number;
  reason: RefundReason;
  reasonDescription?: string;
  status: RefundStatus;
  approvedBy?: string; // CEO User ID
  approvedByName?: string; // CEO full name
  approvedAt?: string;
  processedAt?: string;
  rejectionReason?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
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

