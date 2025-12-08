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
  deletedAt: string | null;
}

export interface StudentBatch {
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
}

export interface IBatch {
  courseId: string;
  centerId: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: string | null;
  schedules: IBatchSchedule[];
  facultyIds: string[];
  students: string[];
}

export interface IBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: IBatch, isDraft: boolean) => void;
  courses: Course[];
  students: Student[];
  faculties: Faculty[];
  initialData?: Partial<IBatch>;
  mode: "add" | "edit";
}

export interface IBatchSchedule {
  day: string;
  startTime: string;
  endTime: string;
  duration: number;
}
