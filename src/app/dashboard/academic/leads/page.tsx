import LeadContent from "@/content/dashboard/academic/leads";
import { getLeads } from "@/lib/network";

export default async function Leads() {
  const leads = await getLeads();

  return <LeadContent leads={leads} />;
}
