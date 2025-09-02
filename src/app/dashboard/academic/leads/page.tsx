import LeadContent from "@/content/dashboard/academic/leads";
import { fetchLeads } from "@/lib/network";

export default async function Leads() {
  const leads = await fetchLeads();

  return <LeadContent leads={leads} />;
}
