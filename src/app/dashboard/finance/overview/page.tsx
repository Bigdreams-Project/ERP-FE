import OverviewContent from "@/content/dashboard/finance/overview";
import { getLoggedInUser } from "@/lib/network";

export default async function Overview() {
  const user = await getLoggedInUser();

  return <OverviewContent user={user} />;
}
