import StudentContent from "@/content/dashboard/academic/students";
import { getCourses, getStudents } from "@/lib/network";

export default async function Students() {
  const students = await getStudents();
  const courses = await getCourses();

  console.log("students", students);
  console.log("courses", courses);

  return <StudentContent students={students} courses={courses} />;
}
