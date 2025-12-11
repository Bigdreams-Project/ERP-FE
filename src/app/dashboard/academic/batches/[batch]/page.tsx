import BatchDetails from "@/content/dashboard/academic/batches/BatchDetails";
import { getBatch } from "@/lib/network";

export default async function Batch({ params }: any) {
  const { batch: batchId } = await params;
  const batch = await getBatch(batchId);

  console.log('Batch:', batch);

  return <BatchDetails batch={batch} />;
}
