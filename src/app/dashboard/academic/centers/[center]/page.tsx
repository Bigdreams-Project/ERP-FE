import CenterDetails from "@/content/dashboard/academic/centers/CenterDetails";
import { getCenter } from "@/lib/network";

export default async function Center({ params }: any) {
  const { center: centerId } = await params;

  const center = await getCenter(centerId);
  
  return <CenterDetails center={center} />;
}
