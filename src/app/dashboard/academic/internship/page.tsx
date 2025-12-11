import InternshipContent from "@/content/dashboard/academic/internship";
import {
  getCenters,
  getCourses,
  getLeads,
  getLoggedInUser,
  getStudents
} from "@/lib/network";

export default async function Internship() {
  // Fetch all data in parallel for maximum speed
  const [students, courses, centers, leads, user] = await Promise.all([
    getStudents(),
    getCourses(),
    getCenters(),
    getLeads(),
    getLoggedInUser(),
  ]);

  return (
    <InternshipContent
      students={students}
      courses={courses}
      centers={centers}
      leads={leads}
      user={user}
    />
  );
}

