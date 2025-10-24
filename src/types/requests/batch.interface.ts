import { IBatchSchedule } from "../academic/batch.interface";

export interface CreateBatch {
  courseId: string;
  centerId: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: string | null;
  schedules: IBatchSchedule[];
  facultyId: string;
  students: string[];
}

export interface UpdateBatch {
  courseId: string;
  centerId: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: string | null;
  schedules: IBatchSchedule[];
  facultyId: string;
  students: string[];
}
