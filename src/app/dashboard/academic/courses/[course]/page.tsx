import CourseDetails from "@/content/dashboard/academic/courses/CourseDetails";
import { getCourse } from "@/lib/network";

export default async function Course({ params }: any) {
  const { course: courseId } = await params;

  const course = await getCourse(courseId);

  console.log("data:", courseId, course);

  return <CourseDetails course={course} />;
}
