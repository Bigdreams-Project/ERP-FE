import { Student } from "@/types/academic/student.interface";
import Card from "./Card";
import { Payment } from "@/types/finance/payment.interface";
import { formatDate } from "@/lib/utils";

interface Props {
  data: Student;
}

const PaymentHistory = ({ data }: Props) => (
  <Card title="Payment History">
    <div className="overflow-x-auto custom-scroll">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            {["Date", "Amount", "Plan", "Transaction ID"].map((header) => (
              <th
                key={header}
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.payments.map((item: Payment, index: any) => (
            <tr key={index}>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                {formatDate(item.paymentDate)}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                ₦{item.amount.toLocaleString()}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.paymentPlan}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.id}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

export default PaymentHistory;
