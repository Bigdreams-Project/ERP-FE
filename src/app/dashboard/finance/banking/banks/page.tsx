export const dynamic = "force-dynamic";
import BanksContent from "@/content/dashboard/finance/banking/banks";
import { getBanks } from "@/lib/network";

export default async function Banks() {
  const banks = await getBanks();

  return <BanksContent banks={banks} />;
}
