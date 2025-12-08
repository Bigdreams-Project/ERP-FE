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

export enum DiscountType {
  PERCENTAGE = "percentage",
  FIXED_AMOUNT = "fixed_amount",
}

export interface DiscountRequest {
  id: string;
  studentId: string;
  student: Student;
  courseId: string;
  course: Course;
  paymentPlanId?: string;
  requestedBy: string; // User ID
  requestedByName?: string; // User full name
  discountType: DiscountType;
  discountValue: number; // Percentage (0-100) or fixed amount in NGN
  originalAmount: number; // Original course fee
  discountedAmount: number; // Amount after discount
  reason: string;
  notes?: string;
  status: DiscountStatus;
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

