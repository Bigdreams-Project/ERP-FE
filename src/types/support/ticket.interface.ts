import { Payment } from "../finance/payment.interface";
import { Student } from "../academic/student.interface";

export enum TicketStatus {
  OPEN = "open",
  IN_PROGRESS = "in_progress",
  RESOLVED = "resolved",
  CLOSED = "closed",
  CANCELLED = "cancelled",
}

export enum TicketPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  URGENT = "urgent",
}

export enum TicketCategory {
  PAYMENT_ISSUE = "payment_issue",
  ENROLLMENT_ISSUE = "enrollment_issue",
  TECHNICAL_ISSUE = "technical_issue",
  REFUND_REQUEST = "refund_request",
  ACCOUNT_ISSUE = "account_issue",
  OTHER = "other",
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdBy: string; // User ID
  createdByName?: string; // User full name
  assignedTo?: string; // User ID
  assignedToName?: string; // User full name
  paymentId?: string;
  payment?: Payment;
  studentId?: string;
  student?: Student;
  attachments?: string[]; // URLs or file paths
  resolution?: string;
  resolvedAt?: string;
  resolvedBy?: string; // User ID
  resolvedByName?: string; // User full name
  createdAt: string;
  updatedAt: string;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  comment: string;
  createdBy: string; // User ID
  createdByName?: string; // User full name
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketRequest {
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  paymentId?: string;
  studentId?: string;
  attachments?: string[];
}

export interface UpdateTicketRequest {
  status?: TicketStatus;
  assignedTo?: string;
  priority?: TicketPriority;
  resolution?: string;
}

export interface CreateTicketCommentRequest {
  ticketId: string;
  comment: string;
  attachments?: string[];
}

