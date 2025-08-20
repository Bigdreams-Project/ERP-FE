export interface IBatch {
  batchCode: string;
  course: string;
  startDate: string;
  endDate: string;
  classSchedule: IClassSchedule[];
  faculty: string;
  selectedStudents: string[];
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
