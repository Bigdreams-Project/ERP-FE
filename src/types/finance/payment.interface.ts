import { Student } from "../academic/student.interface";
import { Bank } from "./bank.interface";

export interface Payment {
  id: string;
  userId: string;
  bankId: string;
  amount: number;
  paid: number;
  pending: number;
  installments: number;
  perInstallment: number;
  estimate: number;
  lastPaymentDate: string;
  nextPaymentDate: string;
  message: string;
  disclaimer: string;
  paymentDate: string;
  paymentPlan: "Lump Sum" | "Installment Plan" | string;
  bank: Bank;
  student: Student;
  createdAt: string;
  updatedAt: string;
}
