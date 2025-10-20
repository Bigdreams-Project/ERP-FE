import { formatDate } from "@/lib/utils";
import { Payment } from "@/types/finance/payment.interface";
import {
  Book,
  Box,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  Edit,
  Gavel,
  Hash,
  Landmark,
  Mail,
  Percent,
  Printer,
  Receipt,
  RefreshCcw,
  Share,
  User,
} from "lucide-react";
import { BiMoney } from "react-icons/bi";

interface Props {
  data: Payment;
}

export const DetailRow = ({
  icon: Icon,
  label,
  value,
  valueClassName = "font-medium text-gray-800",
}: any) => (
  <div className="flex items-start justify-between py-2 border-b border-gray-100 last:border-b-0">
    <div className="flex items-center text-gray-500">
      <Icon className="w-4 h-4 mr-3 text-gray-400" />
      <span className="text-sm">{label}</span>
    </div>
    <span className={valueClassName}>{value}</span>
  </div>
);

export const PaymentSummary = ({ data }: Props) => {
  const getStatus = (pending: number) => {
    return pending === 0 ? "Paid" : "Pending";
  };

  const statusColor =
    getStatus(data.pending) === "Paid"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-700">
        Payment Summary
      </h2>

      {/* Amount and Status */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-3xl font-bold text-gray-900">
          ₦{data.amount.toLocaleString()}
        </span>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}
        >
          {getStatus(data.pending)}
        </span>
      </div>

      {/* Details List */}
      <div className="divide-y divide-gray-100">
        <DetailRow
          icon={Calendar}
          label="Date"
          value={formatDate(data.paymentDate)}
        />
        <DetailRow
          icon={CreditCard}
          label="Payment Method"
          value={data.paymentPlan}
        />
        <DetailRow icon={Hash} label="Reference ID" value={data.id} />
        <DetailRow icon={Landmark} label="Bank" value={data.bank?.bankName} />
        {/* <DetailRow icon={MapPin} label="Center Info" value={data.centerInfo} /> */}
      </div>
    </div>
  );
};

export const PaymentDetails = ({ data }: Props) => {
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-700">
        Payment Details
      </h2>

      <div className="divide-y divide-gray-100 mb-6">
        <DetailRow
          icon={Book}
          label="Course"
          value={
            data.student?.courses && data.student?.courses.length > 0
              ? data.student?.courses[0]?.name
              : "No enrolled courses"
          }
        />
        {/* <DetailRow icon={Box} label="Batch" value={data.batch} /> */}
        <DetailRow
          icon={BiMoney}
          label="Payment Type"
          value={data.paymentPlan}
        />
      </div>

      <div className="divide-y divide-gray-100">
        <DetailRow
          icon={Percent}
          label="Total Fee"
          value={`₦${data.amount.toLocaleString()}`}
          valueClassName="font-bold text-gray-900"
        />
        <DetailRow
          icon={CheckCircle}
          label="Paid So Far"
          value={`₦${data.paid.toLocaleString()}`}
          valueClassName="font-bold text-gray-900"
        />
        <DetailRow
          icon={Receipt}
          label="Balance"
          value={`₦${(data.amount - data.paid).toLocaleString()}`}
          valueClassName="font-extrabold text-red-600"
        />
      </div>
    </div>
  );
};

export const AdditionalActions = ({ data }: any) => {
  const statusColor =
    data.actionStatus === "Inactive"
      ? "bg-gray-200 text-gray-600"
      : "bg-red-100 text-red-700";

  const ActionButton = ({ icon: Icon, label, isDestructive = false }: any) => (
    <button
      className={`flex items-center w-full px-4 py-3 rounded-xl transition duration-150 ease-in-out text-sm font-medium 
        ${
          isDestructive
            ? "bg-red-500 hover:bg-red-600 text-white shadow-md"
            : "text-gray-700 bg-gray-50 hover:bg-gray-100"
        }`}
      onClick={() => console.log(`${label} clicked`)}
    >
      <Icon
        className={`w-4 h-4 mr-3 ${
          isDestructive ? "text-white" : "text-gray-500"
        }`}
      />
      {label}
    </button>
  );

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-700">
          Additional Actions
        </h2>
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor}`}
        >
          {data.actionStatus}
        </span>
      </div>

      <div className="space-y-3">
        <ActionButton icon={Clock} label="Confirm Details" />
        <ActionButton icon={Edit} label="Edit Payment Info" />
        <ActionButton
          icon={RefreshCcw}
          label="Issue Refund"
          isDestructive={true}
        />
        <ActionButton icon={Gavel} label="Dispute Management" />
      </div>
    </div>
  );
};

export const PayerInformation = ({ data }: Props) => {
  const PayerDetail = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-start mb-4">
      <Icon className="w-4 h-4 mr-3 text-gray-400 mt-1" />
      <div className="flex-grow flex justify-between">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="text-sm font-medium text-gray-800 text-right">
          {value}
        </span>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-700">
        Payer Information
      </h2>
      <div className="divide-y divide-gray-100">
        <PayerDetail icon={User} label="Name" value={data.student?.fullName} />
        <PayerDetail icon={User} label="Relationship" value={"Student"} />
        <PayerDetail icon={Mail} label="Contact" value={data.student?.phone} />
        <PayerDetail
          icon={User}
          label="Sponsor"
          value={
            data.student?.guardians && data.student?.guardians.length > 0
              ? data.student?.guardians[0]?.fullname
              : "No Sponsor"
          }
        />
      </div>
    </div>
  );
};

export const ProofOfPayment = ({ data }: any) => {
  const UploadedInfo = ({ uploadedBy, uploadedDate, proofStatus }: any) => (
    <div className="my-4 text-sm text-gray-600">
      <p>
        Uploaded by{" "}
        <span className="font-semibold text-gray-800">{uploadedBy}</span> on{" "}
        {uploadedDate}
      </p>
      <p className="text-xs text-gray-500 mt-1">{proofStatus}</p>
    </div>
  );

  const SecondaryButton = ({ icon: Icon, label, onClick }: any) => (
    <button
      className="flex items-center text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition duration-150 ease-in-out"
      onClick={onClick}
    >
      <Icon className="w-4 h-4 mr-2 text-gray-500" />
      {label}
    </button>
  );

  return (
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold mb-6 text-gray-700">
        Proof of Payment
      </h2>

      <button
        className="flex items-center justify-center w-full px-4 py-3 bg-white border border-gray-300 text-sm font-medium rounded-xl text-gray-700 hover:bg-gray-50 transition duration-150 ease-in-out"
        onClick={() => console.log("View Receipt clicked")}
      >
        <Receipt className="w-5 h-5 mr-3 text-blue-600" />
        View Receipt
      </button>

      <UploadedInfo {...data} />

      <div className="flex flex-wrap gap-2 mt-4">
        <SecondaryButton
          icon={Printer}
          label="Print Receipt"
          onClick={() => console.log("Print Receipt clicked")}
        />
        <SecondaryButton
          icon={Share}
          label="Share on WhatsApp"
          onClick={() => console.log("Share on WhatsApp clicked")}
        />
        <SecondaryButton
          icon={Download}
          label="Download PDF"
          onClick={() => console.log("Download PDF clicked")}
        />
      </div>
    </div>
  );
};
