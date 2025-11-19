// Removed force-dynamic for better caching
import CentersContent from "@/content/dashboard/academic/centers";
import { getCenters, getManagers } from "@/lib/network";

export default async function Centers() {
  // Fetch data in parallel
  const [centers, managers] = await Promise.all([
    getCenters(),
    getManagers(),
  ]);

  return <CentersContent centers={centers} managers={managers} />;
}
