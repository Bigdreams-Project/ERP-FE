import BankDetails from "@/content/dashboard/finance/banking/banks/BankDetails";
import { getBank } from "@/lib/network";

export default async function Bank({ params }: any) {
  const { bank: bankId } = await params;

  const bank = await getBank(bankId);
  console.log("Bank:", bank);

  return <BankDetails bank={bank} />;
}
 