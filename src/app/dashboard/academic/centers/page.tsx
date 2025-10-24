export const dynamic = "force-dynamic";

import CentersContent from "@/content/dashboard/academic/centers";
import { getCenters, getManagers } from "@/lib/network";

export default async function Centers() {
  const centers = await getCenters();
  const managers = await getManagers();

  console.log("Centers:", centers);

  return <CentersContent centers={centers} managers={managers} />;
}
