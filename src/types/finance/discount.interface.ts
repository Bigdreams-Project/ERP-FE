import { Payment } from "./payment.interface";
import { Student } from "../academic/student.interface";
import { Course } from "../academic/course.interface";

export enum DiscountStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  APPLIED = "applied",
  CANCELLED = "cancelled",
}

// Also accept uppercase variants from backend
export type DiscountStatusType = 
  | "pending" | "PENDING"
  | "approved" | "APPROVED"
  | "rejected" | "REJECTED"
  | "applied" | "APPLIED"
  | "cancelled" | "CANCELLED";

export enum DiscountType {
  PERCENTAGE = "percentage",
  FIXED_AMOUNT = "fixed_amount",
}

// Also accept uppercase variants from backend
export type DiscountTypeType = 
  | "percentage" | "PERCENTAGE"
  | "fixed_amount" | "FIXED_AMOUNT";

export interface DiscountRequest {
  id: string;
  studentId: string;
  student?: Student; // Made optional in case backend doesn't populate
  courseId: string;
  course?: Course; // Made optional in case backend doesn't populate
  paymentPlanId?: string;
  requestedBy: string; // User ID
  requestedByName?: string; // User full name
  discountType: DiscountType | DiscountTypeType; // Accept both enum and string types
  discountValue: number; // Percentage (0-100) or fixed amount in NGN
  originalAmount: number; // Original course fee
  discountedAmount: number; // Amount after discount
  reason: string;
  notes?: string;
  status: DiscountStatus | DiscountStatusType | null; // Accept both enum and string types, allow null
  approvedBy?: string; // CEO User ID
  approvedByName?: string; // CEO full name
  approvedAt?: string;
  appliedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiscountRequest {
  studentId: string;
  courseId: string;
  paymentPlanId?: string;
  discountType: DiscountType;
  discountValue: number;
  originalAmount: number; // Original course fee (required for validation)
  discountedAmount: number; // Amount after discount (required for validation)
  reason: string;
  notes?: string;
}

export interface UpdateDiscountRequest {
  status?: DiscountStatus;
  rejectionReason?: string;
  notes?: string;
}

export interface ApproveDiscountRequest {
  discountId: string;
  notes?: string;
}

export interface RejectDiscountRequest {
  discountId: string;
  rejectionReason: string;
}

