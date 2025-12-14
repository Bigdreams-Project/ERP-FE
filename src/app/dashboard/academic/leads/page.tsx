// Removed force-dynamic for better caching
import { AppAuthRoutes } from "@/constants/appRoutes.constant";
import LeadContent from "@/content/dashboard/academic/leads";
import { getCenters, getCourses, getLeads } from "@/lib/network";
import { redirect } from "next/navigation";

export default async function Leads() {
  try {
    // Fetch all data in parallel for maximum speed
    const [leads, centers, courses] = await Promise.all([
      getLeads(),
      getCenters(),
      getCourses(),
    ]);

    return <LeadContent leads={leads} centers={centers} courses={courses} />;
  } catch (err: any) {
    if (err.message === "No active session") {
      redirect(AppAuthRoutes.LOGIN);
    }
    return <LeadContent leads={[]} centers={[]} courses={[]} />;
  }
}
