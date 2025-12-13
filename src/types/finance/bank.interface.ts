import type { Center } from "../academic/center.interface";
import { Payment } from "./payment.interface";

export interface Bank {
  id: string;
  accountName: string;
  accountNumber: string;
  balance: string;
  bankName: string;
  status: string;
  centerId?: string; // For API responses
  center?: Center; // Optional for backward compatibility
  payments?: Payment[];
}

export interface IBank {
  bankName: string;
  accountNumber: string;
  accountName: string;
  balance: number;
}
