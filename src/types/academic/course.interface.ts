export interface ICourse {
  id?: string;
  courseCode: string;
  courseName: string;
  courseType: string;
  durationMonths: number;
  lumpSumFee: number;
  baseEnrollmentFee: number;
  maxInstallments: number;
  costPerInstallment: number | null;
  centers: string[];
}

export interface ICourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (courseData: ICourse, isDraft: boolean) => void;
  initialData?: Partial<ICourse>;
  mode: "add" | "edit";
}
