import StudentContent from "@/content/dashboard/academic/students";
import { getStudents } from "@/lib/network";

export default async function Students() {
  const students = await getStudents();

  return <StudentContent students={students} />;
}
