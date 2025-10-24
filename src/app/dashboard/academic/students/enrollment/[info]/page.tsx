import StudentEnrollmentInfo from "@/content/dashboard/academic/students/StudentEnrollmentInfo";
import { getCourses, getStudent } from "@/lib/network";

export default async function StudentEnrollment({ params }: any) {
  const { info: studentId } = await params;

  const student = await getStudent(studentId);
  const courses = await getCourses();

  return <StudentEnrollmentInfo student={student} courses={courses} />;
}
