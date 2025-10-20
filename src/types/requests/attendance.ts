export interface AttendanceRecord {
  id: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "UNMARKED";
  studentId: string;
}
