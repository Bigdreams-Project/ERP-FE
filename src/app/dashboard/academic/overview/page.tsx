export const dynamic = "force-dynamic";
import OverviewContent from "@/content/dashboard/academic/overview";
import {
  getCenters,
  getCourses,
  getLeads,
  getLoggedInUser,
  getStudents,
} from "@/lib/network";

export default async function Overview() {
  const students = await getStudents();
  const courses = await getCourses();
  const centers = await getCenters();
  const leads = await getLeads();
  const user = await getLoggedInUser();

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
