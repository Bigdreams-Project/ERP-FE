export const dynamic = "force-dynamic";
import OverviewContent from "@/content/dashboard/finance/overview";
import { getFinanceOverview, getLoggedInUser } from "@/lib/network";

export default async function Overview() {
  const user = await getLoggedInUser();
  const overview = await getFinanceOverview();

  return <OverviewContent user={user} overview={overview} />;
}
