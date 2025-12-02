import DashboardOverview from "@/content/dashboard/overview";
import {
  getCenters,
  getCourses,
  getLeads,
  getLoggedInUser,
  getStudents,
  getFinanceOverview,
} from "@/lib/network";

export default async function Dashboard() {
  // Fetch all data in parallel for maximum speed
  const [students, courses, centers, leads, user, financeOverview] = await Promise.all([
    getStudents(),
    getCourses(),
    getCenters(),
    getLeads(),
    getLoggedInUser(),
    getFinanceOverview(),
  ]);

  return (
    <DashboardOverview
      user={user}
      students={students}
      courses={courses}
      centers={centers}
      leads={leads}
      financeOverview={financeOverview}
    />
  );
}
