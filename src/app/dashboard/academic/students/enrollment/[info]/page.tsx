import EnrollmentInfo from "@/content/dashboard/academic/students/StudentEnrollmentInfo";
import { getStudent } from "@/lib/network";

export default async function StudentEnrollmentInfo({ params }: any) {
  const { info: studentId } = await params;

  const student = await getStudent(studentId);

  return <EnrollmentInfo student={student} />;
}
