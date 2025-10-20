import { Center } from "../academic/center.interface";
import { Payment } from "./payment.interface";

export interface Bank {
  id: string;
  accountName: string;
  accountNumber: string;
  balance: string;
  bankName: string;
  status: string;
  center: Center;
  payments: Payment[];
}

export interface IBank {
  bankName: string;
  accountNumber: string;
  accountName: string;
  balance: number;
}
