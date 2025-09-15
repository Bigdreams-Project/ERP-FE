import CoursesContent from "@/content/dashboard/academic/courses";
import { getCourses } from "@/lib/network";

export default async function Courses() {
  const courses = await getCourses();

  return <CoursesContent courses={courses} />;
}
