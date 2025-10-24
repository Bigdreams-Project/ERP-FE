import TransactionDetails from "@/content/dashboard/finance/banking/transactions/TransactionDetails";
import { getTransaction } from "@/lib/network";

export default async function Transaction({ params }: any) {
  const { transaction: transactionId } = await params;
  const transaction = await getTransaction(transactionId);

  return <TransactionDetails transaction={transaction} />;
}
