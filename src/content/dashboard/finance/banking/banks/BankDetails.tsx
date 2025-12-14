"use client";
import TransactionDetailTable from "@/components/finance/tables/TransactionDetail.table";
import { formatDateRange, formatDate } from "@/lib/utils";
import { Bank } from "@/types/finance/bank.interface";
import { Payment } from "@/types/finance/payment.interface";
import { useEffect, useState, useMemo } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  getPaymentMethod,
  getPaymentType,
  getPaymentPlan,
} from "@/components/academic/utils/payment";
import { Download, Printer, FileText, ArrowLeft } from "lucide-react";
import { IoFilter } from "react-icons/io5";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

interface BankDetailsProps {
  bank: Bank;
}

const BankDetails = ({ bank }: BankDetailsProps) => {
  const { user } = useUser();
  const router = useRouter();

  // Check if user can view balance (CEO, Executive Director, Finance Officer)
  const canViewBalance = useMemo(() => {
    if (!user?.role) return false;
    const role = user.role.toUpperCase();
    return (
      role === "CEO" ||
      role === "EXECUTIVE_DIRECTOR" ||
      role === "FINANCE_OFFICER"
    );
  }, [user?.role]);
  const [showPicker, setShowPicker] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [displayRange, setDisplayRange] = useState("");
  const [range, setRange] = useState([
    {
      startDate: new Date(new Date().setDate(new Date().getDate() - 29)),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // Filter states
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all");
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setRange([ranges.selection]);
    setDisplayRange(
      `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
    );

    setShowPicker(false);
  };

  useEffect(() => {
    const start = range[0].startDate!;
    const end = range[0].endDate!;
    setDisplayRange(
      `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
    );
  }, []);

  // Filter transactions based on date range and filters
  const filteredTransactions = useMemo(() => {
    let filtered = bank.payments || [];

    // Filter by date range
    if (range[0].startDate && range[0].endDate) {
      filtered = filtered.filter((payment: Payment) => {
        if (!payment.paymentDate) return false;
        const paymentDate = new Date(payment.paymentDate);
        const startDate = new Date(range[0].startDate!);
        const endDate = new Date(range[0].endDate!);

        // Set time to start/end of day for proper comparison
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        paymentDate.setHours(0, 0, 0, 0);

        return paymentDate >= startDate && paymentDate <= endDate;
      });
    }

    // Filter by payment method
    if (paymentMethodFilter !== "all") {
      filtered = filtered.filter((payment: Payment) => {
        if (!payment.paymentMethod) return false;
        return (
          payment.paymentMethod.toLowerCase() ===
          paymentMethodFilter.toLowerCase()
        );
      });
    }

    // Filter by payment type
    if (paymentTypeFilter !== "all") {
      filtered = filtered.filter((payment: Payment) => {
        if (!payment.paymentType) return false;
        return (
          payment.paymentType.toLowerCase() === paymentTypeFilter.toLowerCase()
        );
      });
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((payment: Payment) => {
        if (!payment.paymentPlan) return false;
        const pending = parseFloat(payment.paymentPlan.pending) || 0;
        const isPaid = pending === 0;
        if (statusFilter === "paid") return isPaid;
        if (statusFilter === "pending") return !isPaid;
        return true;
      });
    }

    return filtered;
  }, [
    bank.payments,
    range,
    paymentMethodFilter,
    paymentTypeFilter,
    statusFilter,
  ]);

  // Excel Export Handler
  const handleExportExcel = () => {
    try {
      // Prepare data for Excel
      const accountInfo = [
        ["Statement of Account"],
        [],
        ["Bank Name", bank.bankName],
        ["Account Name", bank.accountName],
        ["Account Number", bank.accountNumber],
        ["Center", bank.center?.name || "N/A"],
        ...(canViewBalance
          ? [["Current Balance", `₦${parseInt(bank.balance).toLocaleString()}`]]
          : []),
        ["Date Range", displayRange],
        [],
        ["Transactions"],
        [],
        [
          "Date",
          "Method",
          "Type",
          "Plan",
          "Amount (₦)",
          "Balance (₦)",
          "Status",
          "Student",
          "Course",
        ],
      ];

      // Add transaction rows
      filteredTransactions.forEach((payment: Payment) => {
        const pending = payment.paymentPlan
          ? parseFloat(payment.paymentPlan.pending) || 0
          : 0;
        const isPaid = pending === 0;
        accountInfo.push([
          formatDate(payment.paymentDate),
          getPaymentMethod(payment.paymentMethod) || "",
          getPaymentType(payment.paymentType) || "",
          getPaymentPlan(payment.paymentPlan?.name) || "",
          payment.amount.toLocaleString(),
          payment.paymentPlan?.pending || "0",
          isPaid ? "Paid" : "Pending",
          payment.student?.fullName || "N/A",
          payment.course?.name || "N/A",
        ]);
      });

      // Create workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(accountInfo);

      // Set column widths
      ws["!cols"] = [
        { wch: 15 }, // Date
        { wch: 15 }, // Method
        { wch: 12 }, // Type
        { wch: 12 }, // Plan
        { wch: 15 }, // Amount
        { wch: 15 }, // Balance
        { wch: 10 }, // Status
        { wch: 25 }, // Student
        { wch: 25 }, // Course
      ];

      XLSX.utils.book_append_sheet(wb, ws, "Statement of Account");

      // Generate filename
      const sanitizedBankName = bank.bankName
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();
      const filename = `statement_of_account_${sanitizedBankName}_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;

      // Download
      XLSX.writeFile(wb, filename);
    } catch (error) {
      alert("Failed to export to Excel. Please try again.");
    }
  };

  // PDF Download Handler
  const handleDownloadPDF = async () => {
    try {
      const statementElement = document.getElementById("statement-of-account");
      if (!statementElement) {
        alert("Statement content not found. Please try again.");
        return;
      }

      // Generate canvas from the statement
      const canvas = await html2canvas(statementElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      // Calculate PDF dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Generate filename
      const sanitizedBankName = bank.bankName
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();
      const filename = `statement_of_account_${sanitizedBankName}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      // Download PDF
      pdf.save(filename);
    } catch (error) {
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // Print Ledger Handler
  const handlePrintLedger = () => {
    const statementElement = document.getElementById("statement-of-account");
    if (!statementElement) {
      alert("Statement content not found. Please try again.");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print the statement.");
      return;
    }

    const clonedElement = statementElement.cloneNode(true) as HTMLElement;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Statement of Account - ${bank.bankName}</title>
        <meta charset="utf-8">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @media print {
            @page { margin: 0.5in; }
            body { margin: 0; padding: 0; font-family: sans-serif; }
            .print-hidden { display: none !important; }
            * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            padding: 20px;
            background: white;
          }
        </style>
      </head>
      <body>
        ${clonedElement.innerHTML}
      </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }, 1000);
    };
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-white min-h-screen font-sans">
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Statement of Account - Off-screen element for PDF/Print */}
        <div
          id="statement-of-account"
          className="absolute left-[-9999px] top-0 w-[800px] bg-white dark:bg-white"
          style={{ position: "absolute", left: "-9999px" }}
        >
          <div className="max-w-4xl mx-auto bg-white dark:bg-white p-8">
            {/* Header */}
            <div className="mb-6 border-b-2 border-gray-300 pb-4">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/Logo.png"
                  alt="Tecterminal Logo"
                  className="h-12 w-auto"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-900">
                Statement of Account
              </h1>
            </div>

            {/* Account Details */}
            <div className="mb-6 space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-700">
                    Bank Name:
                  </span>
                  <span className="ml-2 text-gray-900 dark:text-gray-900">{bank.bankName}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-700">
                    Account Name:
                  </span>
                  <span className="ml-2 text-gray-900 dark:text-gray-900">{bank.accountName}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-700">
                    Account Number:
                  </span>
                  <span className="ml-2 text-gray-900 dark:text-gray-900">
                    {bank.accountNumber}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-700">Center:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-900">
                    {bank.center?.name || "N/A"}
                  </span>
                </div>
                {canViewBalance && (
                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-700">
                      Current Balance:
                    </span>
                    <span className="ml-2 text-gray-900 dark:text-gray-900 font-bold">
                      ₦{parseInt(bank.balance).toLocaleString()}
                    </span>
                  </div>
                )}
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-700">
                    Date Range:
                  </span>
                  <span className="ml-2 text-gray-900 dark:text-gray-900">{displayRange}</span>
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-900 mb-4">
                Transactions
              </h2>
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-700 border border-gray-300">
                      Date
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                      Method
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                      Type
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                      Plan
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                      Amount (₦)
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                      Balance (₦)
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-4 text-center text-gray-500 border border-gray-300"
                      >
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map(
                      (payment: Payment, index: number) => {
                        const pending = payment.paymentPlan
                          ? parseFloat(payment.paymentPlan.pending) || 0
                          : 0;
                        const isPaid = pending === 0;
                        return (
                          <tr key={index}>
                            <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-900 border border-gray-300">
                              {formatDate(payment.paymentDate)}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-900 border border-gray-300">
                              {getPaymentMethod(payment.paymentMethod) || "N/A"}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-900 border border-gray-300">
                              {getPaymentType(payment.paymentType) || "N/A"}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-900 border border-gray-300">
                              {getPaymentPlan(payment.paymentPlan?.name) ||
                                "N/A"}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-900 border border-gray-300">
                              ₦{payment.amount.toLocaleString()}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-900 border border-gray-300">
                              ₦{payment.paymentPlan?.pending || "0"}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-900 border border-gray-300">
                              {isPaid ? "Paid" : "Pending"}
                            </td>
                          </tr>
                        );
                      }
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
              <p>Powered by TecTerminal</p>
              <p className="mt-2" suppressHydrationWarning>
                Generated on {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-4">
            <button
              onClick={() => router.push("/dashboard/finance/banking/banks")}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition duration-150 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Banks
            </button>
          </div>
          <div className="flex items-center justify-between text-gray-400">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              Account - {bank.bankName}
            </h1>
            <p className="text-md">{formatDateRange(displayRange)}</p>
          </div>
          {canViewBalance && (
            <div className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-lg shadow-gray-300 mt-4">
              <p className="text-gray-400 font-semibold text-lg">
                Current Balance
              </p>
              <p className="text-4xl font-bold text-indigo-500">
                ₦{parseInt(bank.balance).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleExportExcel}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Export to Excel
            </button>
            <button
              onClick={handleDownloadPDF}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download PDF
            </button>
            <button
              onClick={handlePrintLedger}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2"
            >
              <Printer className="w-5 h-5" />
              Print Ledger
            </button>
            <button
              onClick={() => setShowFilterModal(!showFilterModal)}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-black dark:text-gray-200 rounded-xl font-semibold transition-colors shadow-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800"
            >
              <IoFilter className="w-5 h-5 text-black dark:text-gray-200" />
              Filter
            </button>
          </div>

          {/* Filter Modal */}
          {showFilterModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Filters
                  </h3>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date Range
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={displayRange || "Select a date range"}
                      onClick={() => {
                        setShowPicker(!showPicker);
                        setShowFilterModal(false);
                      }}
                      className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  </div>

                  {/* Payment Method Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Method
                    </label>
                    <select
                      value={paymentMethodFilter}
                      onChange={(e) => setPaymentMethodFilter(e.target.value)}
                      className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                      <option value="all">All Methods</option>
                      <option value="bank-transfer">Bank Transfer</option>
                      <option value="pos">POS</option>
                      <option value="cash">Cash</option>
                    </select>
                  </div>

                  {/* Payment Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Payment Type
                    </label>
                    <select
                      value={paymentTypeFilter}
                      onChange={(e) => setPaymentTypeFilter(e.target.value)}
                      className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                      <option value="all">All Types</option>
                      <option value="monthly">Monthly</option>
                      <option value="bi-monthly">Bi-Monthly</option>
                      <option value="quarterly">Quarterly</option>
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                      <option value="all">All Statuses</option>
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => {
                      setPaymentMethodFilter("all");
                      setPaymentTypeFilter("all");
                      setStatusFilter("all");
                      setRange([
                        {
                          startDate: new Date(
                            new Date().setDate(new Date().getDate() - 29)
                          ),
                          endDate: new Date(),
                          key: "selection",
                        },
                      ]);
                    }}
                    className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => setShowFilterModal(false)}
                    className="px-4 py-2 text-sm bg-indigo-600 dark:bg-indigo-700 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Date Picker */}
          {showPicker && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Select Date Range
                  </h3>
                  <button
                    onClick={() => setShowPicker(false)}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
                <DateRangePicker
                  ranges={range}
                  onChange={handleSelect}
                  moveRangeOnFirstSelection={false}
                  className="text-black"
                />
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg shadow-gray-400 dark:shadow-gray-900 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-4 text-black dark:text-gray-100">
            Transactions
          </h2>
          <TransactionDetailTable
            transactions={filteredTransactions}
            searchQuery=""
            filterOptions={{
              startDate: range[0].startDate?.toISOString() || "",
              endDate: range[0].endDate?.toISOString() || "",
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default BankDetails;
