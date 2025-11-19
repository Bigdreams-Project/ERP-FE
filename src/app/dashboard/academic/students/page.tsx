import StudentContent from "@/content/dashboard/academic/students";
import {
  getCenters,
  getCourses,
  getLeads,
  getLoggedInUser,
  getStudents
} from "@/lib/network";

export default async function Students() {
  // Fetch all data in parallel for maximum speed
  const [students, courses, centers, leads, user] = await Promise.all([
    getStudents(),
    getCourses(),
    getCenters(),
    getLeads(),
    getLoggedInUser(),
  ]);

  return (
    <StudentContent
      students={students}
      courses={courses}
      centers={centers}
      leads={leads}
      user={user}
    />
  );
}
