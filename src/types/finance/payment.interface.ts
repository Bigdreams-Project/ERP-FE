import { Course } from "../academic/course.interface";
import { Student } from "../academic/student.interface";
import { Bank } from "./bank.interface";

export interface PaymentPlan {
  id: string;
  userId: string;
  name: string;
  amount: number;
  paid: string;
  pending: string;
  courseId: string;
  installments: string;
  perInstallment: string;
  estimate: string;
  lastPaymentDate: string;
  nextPaymentDate: string;
  regDate: string;
  course: Course;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  userId: string;
  bankId: string;
  amount: number;
  balance: number;
  message: string;
  disclaimer: string;
  paymentDate: string;
  paymentPlan: PaymentPlan;
  paymentType: string;
  paymentMethod: string;
  bank: Bank;
  course: Course;
  student: Student;
  createdAt: string;
  updatedAt: string;
}
