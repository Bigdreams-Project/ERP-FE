import { Student } from "@/types/academic/student.interface";
import Card from "./Card";
import InfoItem from "./InfoItem";
import { formatDate } from "@/lib/utils";

interface Props {
  data: Student;
}

const InvoiceDetails = ({ data }: Props) => (
  <Card title="Invoice Details" className="h-full">
    <div className="grid grid-cols-2 gap-x-6">
      <InfoItem
        label="Total Fee"
        value={
          data.payments && data.payments.length > 0
            ? `₦${data.payments[0].estimate.toLocaleString()}`
            : "N/A"
        }
      />
      <InfoItem
        label="Amount Paid"
        value={
          data.payments && data.payments.length > 0
            ? `₦${data.payments[0].amount.toLocaleString()}`
            : "N/A"
        }
        valueColor="text-green-600"
      />

      <InfoItem
        label="Balance Due"
        value={
          data.payments && data.payments.length > 0
            ? `₦${data.payments[0].pending.toLocaleString()}`
            : "N/A"
        }
        valueColor="text-red-600"
      />
      <InfoItem
        label="Next Payment Due"
        value={
          data.payments && data.payments.length > 0
            ? formatDate(data.payments[0].nextPaymentDate)
            : "N/A"
        }
        valueColor="text-gray-700"
      />
    </div>
  </Card>
);

export default InvoiceDetails;
