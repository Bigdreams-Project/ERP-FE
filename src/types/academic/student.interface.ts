export interface IStudent {
  id?: string;
  studentId: string | null;
  leadId: string | null;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  parentGuardianName: string; 
  parentGuardianPhone: string; 
  parentGuardianEmail: string | null;
  courseEnrolled: string;
  dateEnrolled: string;
  batch: string;
  paymentPlan: string;
  lumpSum: number | null;
  numberOfInstallments: number | null;
  comments: string | null;
}

export interface IStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: IStudent) => void;
  initialData?: Partial<IStudent>;
  mode: "enroll";
}
