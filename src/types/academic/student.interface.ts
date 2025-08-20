export interface IStudentEnrollment {
  leadId: string | null;
  fullName: string;
  phoneNumber: string;
  email: string;
  homeAddress: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string | null;
  courseOfInterest: string;
  batch: string;
  paymentPlan: "Lump Sum" | "Installments";
  lumpSum: number | null;
  numberOfInstallments: number | null;
  comments: string | null;
}

export interface IStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (studentData: IStudentEnrollment) => void;
  initialData?: Partial<IStudentEnrollment>;
  mode: "enroll";
}
