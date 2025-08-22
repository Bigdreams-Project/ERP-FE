import { IStudent } from "./student.interface";

export interface IBatch {
  id?: string;
  code: string;
  course: string;
  startDate: string;
  endDate: string;
  createdDate: string;
  duration: string;
  status: string;
  schedule: IClassSchedule[];
  faculty: string;
  students: IStudent[];
}

export interface IBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (batchData: IBatch, isDraft: boolean) => void;
  initialData?: Partial<IBatch>;
  mode: "add" | "edit";
}

export interface IClassSchedule {
  dayOfWeek: string;
  time: string;
  duration: number;
}
