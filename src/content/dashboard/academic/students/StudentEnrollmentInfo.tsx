"use client";
import { Student } from "@/types/academic/student.interface";
import React, { useState } from "react";

const mockData = {
  studentName: "John Doe",
  studentId: "JD-001-2023",
  course: "Web Development Fundamentals",
  batch: "WD-101-B12",
  enrollmentDate: "January 15, 2023",
  status: "Active",

  totalFee: "₦1,200.00",
  amountPaid: "₦700.00",
  balanceDue: "₦500.00",
  nextPaymentDue: "March 15, 2024",

  paymentHistory: [
    {
      date: "Feb 15, 2024",
      amount: "$200.00",
      method: "Bank Transfer",
      transId: "BTRX-78901",
    },
    {
      date: "Jan 15, 2024",
      amount: "$500.00",
      method: "POS",
      transId: "POS-ABC1234",
    },
    {
      date: "Dec 10, 2023",
      amount: "$300.00",
      method: "Cash",
      transId: "CASH-XYZ567",
    },
    {
      date: "Nov 05, 2023",
      amount: "$150.00",
      method: "Bank Transfer",
      transId: "BTRX-98765",
    },
    {
      date: "Oct 01, 2023",
      amount: "$100.00",
      method: "POS",
      transId: "POS-DEF9876",
    },
  ],

  recentlyUploaded: ["receipt_john_doe_feb_2024.pdf", "pos_slip_jan_2024.jpg"],

  systemActions: [
    "Update payment status from Pending to Paid.",
    "Add amount to daily inflow in Aptech Kubwa at Zenith Bank.",
    "Notify course manager and student via WhatsApp/SMS.",
    "Unlock portal access if restricted.",
  ],
};

const Card = ({ title, children, className = "" }: any) => (
  <div
    className={`p-6 bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}
  >
    {title && (
      <h2 className="text-lg font-semibold text-gray-800 mb-5">{title}</h2>
    )}
    {children}
  </div>
);

const InfoItem = ({
  label,
  value,
  valueColor = "text-gray-900",
  isStatus = false,
}: any) => (
  <div className="text-sm pb-4">
    <span className="text-gray-500 font-normal mr-2">{label}:</span>
    {isStatus ? (
      <span className="px-2 py-0.5 text-xs font-semibold rounded bg-green-100 text-green-700">
        {value}
      </span>
    ) : (
      <span className={`font-medium ${valueColor}`}>{value}</span>
    )}
  </div>
);

const StudentEnrollmentInfo = ({ data }: any) => (
  <Card title="Student & Enrollment Info" className="h-full">
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
      <InfoItem label="Student Name" value={data.studentName} />
      <InfoItem label="Student ID" value={data.studentId} />

      <InfoItem label="Course" value={data.course} />
      <InfoItem label="Batch" value={data.batch} />

      <InfoItem label="Enrollment Date" value={data.enrollmentDate} />
      <InfoItem label="Status" value={data.status} isStatus={true} />
    </div>
  </Card>
);

const InvoiceDetails = ({ data }: any) => (
  <Card title="Invoice Details" className="h-full">
    <div className="grid grid-cols-2 gap-x-6">
      <InfoItem label="Total Fee" value={data.totalFee} />
      <InfoItem
        label="Amount Paid"
        value={data.amountPaid}
        valueColor="text-green-600"
      />

      <InfoItem
        label="Balance Due"
        value={data.balanceDue}
        valueColor="text-red-600"
      />
      <InfoItem
        label="Next Payment Due"
        value={data.nextPaymentDue}
        valueColor="text-gray-700"
      />
    </div>
  </Card>
);

const NewPaymentForm = () => {
  const [formData, setFormData] = useState({
    amount: "0.00",
    paymentMethod: "Bank Transfer",
    date: new Date().toISOString().split("T")[0],
    transactionId: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRecordPayment = () => {
    console.log("Recording Payment:", formData);
    alert(
      `Payment Recorded: ${formData.amount} via ${formData.paymentMethod}. Check console for details.`
    );
  };

  return (
    <Card title="New Payment">
      <div className="space-y-4">
        {/* Amount Received */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount Received
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg font-bold"
            placeholder="0.00"
          />
        </div>

        {/* Payment Method */}
        <div>
          <label
            htmlFor="paymentMethod"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Payment Method
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
          >
            <option>Bank Transfer</option>
            <option>POS</option>
            <option>Cash</option>
            <option>Online Payment Gateway</option>
          </select>
          {/* Placeholder for the dropdown arrow seen in the image (handled by appearance-none and custom arrow if needed) */}
        </div>

        {/* Date of Payment */}
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date of Payment
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Transaction ID */}
        <div>
          <label
            htmlFor="transactionId"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Transaction ID
          </label>
          <input
            type="text"
            id="transactionId"
            name="transactionId"
            value={formData.transactionId}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter transaction reference"
          />
        </div>

        {/* Record Payment Button */}
        <button
          onClick={handleRecordPayment}
          className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out shadow-md"
        >
          Record Payment
        </button>
      </div>
    </Card>
  );
};

const ProofOfPaymentUpload = ({ data }: any) => {
  const CloudUpload = (props: any) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 7.5L14 21h-2" />
      <path d="m16 16-4-4-4 4" />
      <path d="M12 12v9" />
    </svg>
  );

  return (
    <Card title="Upload Proof of Payment" className="h-">
      <p className="text-xs text-gray-500 mb-4">
        Accepted formats: PDF, JPG, PNG (max 5MB)
      </p>

      {/* Drag and Drop Area */}
      <div
        className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl mb-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition duration-150"
        onClick={() => document.getElementById("file-upload")!.click()}
      >
        <CloudUpload className="text-gray-400 mb-2" />
        <p className="text-sm font-medium text-gray-600">
          Drag & drop files here or click to upload
        </p>
        <input type="file" id="file-upload" className="hidden" multiple />
      </div>

      {/* Recently Uploaded */}
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        Recently Uploaded:
      </h3>
      <div className="space-y-1">
        {data.recentlyUploaded.map((file: any, index: any) => (
          <p
            key={index}
            className="text-xs text-blue-600 hover:underline cursor-pointer"
          >
            {file}
          </p>
        ))}
      </div>
    </Card>
  );
};

const PaymentHistory = ({ data }: any) => (
  <Card title="Payment History">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            {["Date", "Amount", "Method", "Trans. ID"].map((header) => (
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
          {data.paymentHistory.map((item: any, index: any) => (
            <tr key={index}>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                {item.date}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                {item.amount}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.method}
              </td>
              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.transId}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

const SystemActionsSummary = ({ data }: any) => (
  <Card title="System Actions Summary" className="h-">
    <p className="text-sm text-gray-600 mb-4">
      Upon successful payment recording, the system will automatically:
    </p>
    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
      {data.systemActions.map((action: any, index: any) => (
        <li key={index} className="pl-1">
          {action}
        </li>
      ))}
    </ul>
  </Card>
);

interface StudentDetailsProps {
  student: Student;
}

const EnrollmentInfo = ({ student }: StudentDetailsProps) => {
  const data = mockData;

  return (
    <div className="min-h-screen bg-white font-sans">
      <style>
        {`
        select {
          background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1rem;
          padding-right: 2.5rem;
        }
      `}
      </style>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Grid Layout: 2/3 (Left) and 1/3 (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Student & Enrollment Info (Combined with Invoice Details on mobile) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <StudentEnrollmentInfo data={data} />
              </div>
              <div className="md:col-span-2">
                <InvoiceDetails data={data} />
              </div>
            </div>

            {/* New Payment Form */}
            <NewPaymentForm />
          </div>

          {/* RIGHT COLUMN (1/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upload Proof of Payment */}
            <ProofOfPaymentUpload data={data} />

            {/* Payment History */}
            <PaymentHistory data={data} />

            {/* System Actions Summary */}
            <SystemActionsSummary data={data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentInfo;
