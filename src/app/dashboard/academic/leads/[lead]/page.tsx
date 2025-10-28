import LeadDetails from "@/content/dashboard/academic/leads/LeadDetails";
import { getLead } from "@/lib/network";

export default async function Lead({ params }: any) {
  const { lead: leadId } = await params;
  const lead = await getLead(leadId);

  return <LeadDetails lead={lead} />;
}
