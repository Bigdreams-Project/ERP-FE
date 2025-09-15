import { Center } from "./center.interface";
import { Course } from "./course.interface";
import { BatchStudent, IStudent, Student } from "./student.interface";

export interface Faculty {
  id?: string;
  fullname: string;
  phone: string;
  createdAt: string;
}

export interface BatchNote {
  id: string;
  title: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface Batch {
  id?: string;
  code: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  duration: string;
  status: string;
  faculty: Faculty;
  course: Course;
  center: Center;
  schedules: IBatchSchedule[];
  students: BatchStudent[];
  notes: BatchNote[];
}

export interface StudentBatch {
  batch: {
    id?: string;
    code: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    duration: string;
    status: string;
    faculty: Faculty;
    course: Course;
    center: Center;
    schedules: IBatchSchedule[];
    students: Student[];
  };
}

export interface IBatch {
  id?: string;
  code: string;
  course: string;
  startDate: string;
  endDate: string;
  createdDate: string;
  duration: string;
  status: string;
  schedule: IBatchSchedule[];
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

export interface IBatchSchedule {
  day: string;
  startTime: string;
  endTime: string;
  duration: number;
}

// model BatchSchedule {
//   id        String   @id @default(cuid()) @map("_id")
//   day       String
//   startTime DateTime @map("start_time")
//   endTime   DateTime @map("end_time")
//   duration  Int
//   batchId   String?
//   faculty   Faculty?
//   batch     Batch?   @relation(fields: [batchId], references: [id])
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
// }
