import StudentDetails from "@/content/dashboard/academic/students/StudentDetails";
import { getStudent } from "@/lib/network";

export default async function Student({ params }: any) {
  const { student: studentId } = await params;

  const student = await getStudent(studentId);

  return <StudentDetails student={student} />;
}
