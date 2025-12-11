import LeadDetails from "@/content/dashboard/academic/leads/LeadDetails";
import { getCenters, getCourses, getLead } from "@/lib/network";

export default async function Lead({ params }: any) {
  const { lead: leadId } = await params;
  
  const [lead, courses, centers] = await Promise.all([
    getLead(leadId),
    getCourses(),
    getCenters(),
  ]);

  return <LeadDetails lead={lead} courses={courses} centers={centers} />;
}
