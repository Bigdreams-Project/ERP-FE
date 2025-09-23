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
  lumpSumFee: number | null;
  numberOfInstallments: number | null;
  courseId: string;
  batchId: string;
  paymentPlanId: string;
  notes: string;
}

export interface UpdateStudent {
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
  lumpSumFee: number | null;
  numberOfInstallments: number | null;
  courseId: string;
  batchId: string;
  paymentPlanId: string;
  notes: string;
}
