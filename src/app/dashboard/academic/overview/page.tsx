// Removed force-dynamic for better caching
import OverviewContent from "@/content/dashboard/academic/overview";
import {
  getCenters,
  getCourses,
  getLeads,
  getLoggedInUser,
  getStudents,
} from "@/lib/network";

export default async function Overview() {
  // Fetch all data in parallel for maximum speed
  const [students, courses, centers, leads, user] = await Promise.all([
    getStudents(),
    getCourses(),
    getCenters(),
    getLeads(),
    getLoggedInUser(),
  ]);

  return (
    <OverviewContent
      user={user}
      students={students}
      courses={courses}
      centers={centers}
      leads={leads}
    />
  );
}
