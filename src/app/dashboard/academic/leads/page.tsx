import LeadContent from "@/content/dashboard/academic/leads";
import { getLeads } from "@/lib/network";

export default async function Leads() {
  const leads = await getLeads();
  console.log('Data', leads)

  return <LeadContent leads={leads} />;
}
