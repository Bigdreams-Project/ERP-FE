import StudentDetails from "@/content/dashboard/academic/students/StudentDetails";
import { getCenters, getCourses, getLeads, getStudent } from "@/lib/network";

export default async function Student({ params }: any) {
  const { student: studentId } = await params;

  const student = await getStudent(studentId);
  const courses = await getCourses();
  const centers = await getCenters();
  const leads = await getLeads();

  return (
    <StudentDetails
      student={student}
      courses={courses}
      centers={centers}
      leads={leads}
    />
  );
}
