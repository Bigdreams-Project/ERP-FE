import ExecutiveDashboard from "@/content/dashboard/executive";
import {
  getCenters,
  getCourses,
  getLeads,
  getLoggedInUser,
  getStudents,
  getFinanceOverview,
  getBatches,
} from "@/lib/network";

export default async function ExecutiveDashboardPage() {
  // Fetch all data in parallel for maximum speed
  const [students, courses, centers, leads, user, financeOverview, batches] = await Promise.all([
    getStudents(),
    getCourses(),
    getCenters(),
    getLeads(),
    getLoggedInUser(),
    getFinanceOverview(),
    getBatches(),
  ]);

  return (
    <ExecutiveDashboard
      user={user}
      students={students}
      courses={courses}
      centers={centers}
      leads={leads}
      financeOverview={financeOverview}
      batches={batches}
    />
  );
}

