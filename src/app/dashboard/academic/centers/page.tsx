export const dynamic = "force-dynamic";

import CentersContent from "@/content/dashboard/academic/centers";
import { getCenters } from "@/lib/network";

export default async function Centers() {
  const centers = await getCenters();

  return <CentersContent centers={centers} />;
}
