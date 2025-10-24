import CourseDetails from "@/content/dashboard/academic/courses/CourseDetails";
import { getCourse, getCourseFee, getCourseUnassignedCenters } from "@/lib/network";

export default async function Course({ params }: any) {
  const { course: courseId } = await params;

  const course = await getCourse(courseId);
  const centers = await getCourseUnassignedCenters(courseId);

  return (
    <CourseDetails
      course={course}
      centers={centers}
    />
  );
}
