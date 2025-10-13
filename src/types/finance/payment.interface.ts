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
  createdAt: string;
  updatedAt: string;
}
