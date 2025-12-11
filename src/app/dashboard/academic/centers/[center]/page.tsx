import CenterDetails from "@/content/dashboard/academic/centers/CenterDetails";
import { getCenter, getManagers } from "@/lib/network";

export default async function Center({ params }: any) {
  const { center: centerId } = await params;

  const [center, managers] = await Promise.all([
    getCenter(centerId),
    getManagers(),
  ]);
  
  return <CenterDetails center={center} managers={managers} />;
}
