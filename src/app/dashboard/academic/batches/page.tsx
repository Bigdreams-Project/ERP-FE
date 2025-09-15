import BatchesContent from "@/content/dashboard/academic/batches";
import { getBatches } from "@/lib/network";

export default async function Batches() {
  const batches = await getBatches();
  console.log("data:", batches);

  return <BatchesContent batches={batches} />;
}
