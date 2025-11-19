export interface CreateStudent {
  leadId: string | null;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  centerId: string;
  enrolledDate: string;
  birthDate: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string | null;
  guardianAddress: string;
  courseFee: string | null;
  amount: string | null;
  lumpSumFee: string | null;
  numberOfInstallments: string | null;
  paymentPlan: string;
  paymentType: string;
  paymentMethod: string;
  notes: string;
  courseId: string;
  bankId: string;
  batchId: string | null;
}

export interface UpdateStudent {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  centerId: string;
  enrolledDate: string;
  birthDate: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string | null;
  guardianAddress: string;
  courseFee: string | null;
  lumpSumFee: string | null;
  numberOfInstallments: string | null;
  paymentPlan: string;
  notes: string;
  courseId: string;
  batchId: string | null;
}

export interface CreateStudentPayment {
  studentId: string;
  courseId: string;
  bankId: string;
  amount: number;
  courseFee: number;
  numberOfInstallments: number;
  paymentPlan: string;
  paymentType: string;
  paymentMethod: string;
}
