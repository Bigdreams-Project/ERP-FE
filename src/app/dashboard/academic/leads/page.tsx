import { AppAuthRoutes } from "@/constants/appRoutes.constant";
import LeadContent from "@/content/dashboard/academic/leads";
import { getCenters, getCourses, getLeads } from "@/lib/network";
import { redirect } from 'next/navigation';

export default async function Leads() {
  let leads = [];
  let centers = [];
  let courses = [];

  try {
    leads = await getLeads();
    centers = await getCenters();
    courses = await getCourses();

  } catch (err: any) {
    if (err.message === "No active session") {
      console.error("No active session, redirecting to login.");
      redirect(AppAuthRoutes.LOGIN);
    }
    console.error("Failed to fetch leads:", err.message);
  }

  return <LeadContent leads={leads} centers={centers} courses={courses} />;
}
