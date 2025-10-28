import StudentContent from "@/content/dashboard/academic/students";
import {
  getCenters,
  getCourses,
  getLeads,
  getStudents
} from "@/lib/network";

export default async function Students() {
  const students = await getStudents();
  const courses = await getCourses();
  const centers = await getCenters();
  const leads = await getLeads();

  return (
    <StudentContent
      students={students}
      courses={courses}
      centers={centers}
      leads={leads}
    />
  );
}
