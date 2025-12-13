"use client";

import {
  getPaymentMethod,
  getPaymentType,
} from "@/components/academic/utils/payment";
import { formatDate } from "@/lib/utils";
import { Payment } from "@/types/finance/payment.interface";
import Link from "next/link";
import {
  Book,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
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
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReceiptPreview } from "./ReceiptPreview";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CreateRefundRequest } from "@/types/finance/refund.interface";
import { CreateTicketRequest } from "@/types/support/ticket.interface";
import RefundRequestModal from "@/components/modals/finance/RefundRequestModal";
import CreateTicketModal from "@/components/modals/support/CreateTicketModal";
import TransactionApprovalModal from "@/components/modals/finance/TransactionApprovalModal";
import { createRefundRequestClient } from "@/lib/client-network";
import { createTicketClient } from "@/lib/client-network";
import { approveTransactionClient } from "@/lib/client-network";
import { showSuccess, showError } from "@/lib/toast";

interface Props {
  data: Payment;
}

export const DetailRow = ({
  icon: Icon,
  label,
  value,
  valueClassName = "font-medium text-gray-800 dark:text-gray-200",
}: any) => (
  <div className="flex items-start justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
    <div className="flex items-center text-gray-500 dark:text-gray-400">
      <Icon className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
      <span className="text-sm">{label}</span>
    </div>
    <span className={valueClassName}>{value}</span>
  </div>
);

export const DetailRow2 = ({
  icon: Icon,
  label,
  value,
  valueClassName = "font-medium text-gray-800 dark:text-gray-200",
}: any) => (
  <div className="flex items-start gap-4 justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
    <div className="flex items-center text-gray-500 dark:text-gray-400">
      <Icon className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
      <span className="text-sm">{label}</span>
    </div>
    <span className={valueClassName}>{value}</span>
  </div>
);

export const PaymentSummary = ({ data }: Props) => {
  const getStatus = (pending: number) => {
    return pending === 0 ? "Paid" : "Pending";
  };

  if (!data || !data.paymentPlan) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm mb-6">
        <p className="text-gray-500 dark:text-gray-400">
          Transaction data not available
        </p>
      </div>
    );
  }

  const statusColor =
    getStatus(parseFloat(data.paymentPlan.pending || "0")) === "Paid"
      ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-200"
      : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-200";

  return (
    <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm mb-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-700 dark:text-gray-200">
        Payment Summary
      </h2>

      {/* Amount and Status */}
      <div className="flex items-center justify-between mb-6">
        <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          ₦{data.amount.toLocaleString()}
        </span>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}
        >
          {getStatus(parseFloat(data.paymentPlan.pending || "0"))}
        </span>
      </div>

      {/* Details List */}
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        <DetailRow
          icon={Calendar}
          label="Date"
          value={formatDate(data.paymentDate)}
        />
        <DetailRow
          icon={CreditCard}
          label="Payment Method"
          value={getPaymentMethod(data.paymentMethod)}
        />
        {data.paidBy && (
          <DetailRow icon={User} label="Paid By" value={data.paidBy} />
        )}
        <DetailRow icon={Hash} label="Reference ID" value={data.id} />
        <DetailRow icon={Landmark} label="Bank" value={data.bank?.bankName} />
        {/* <DetailRow icon={MapPin} label="Center Info" value={data.centerInfo} /> */}
      </div>
    </div>
  );
};

export const PaymentDetails = ({ data }: Props) => {
  if (!data || !data.paymentPlan) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm mb-6">
        <p className="text-gray-500 dark:text-gray-400">
          Payment details not available
        </p>
      </div>
    );
  }

  // Check for applied discount
  const appliedDiscount = data.paymentPlan?.discountRequests?.find(
    (d: any) => d.status === "APPLIED" || d.status === "applied"
  );
  const hasDiscount = !!appliedDiscount;
  const discountSavings = appliedDiscount
    ? appliedDiscount.originalAmount - appliedDiscount.discountedAmount
    : 0;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm mb-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-700 dark:text-gray-200">
        Payment Details
      </h2>

      <div className="divide-y divide-gray-100 dark:divide-gray-700 mb-6">
        <DetailRow2
          icon={Book}
          label="Course"
          value={data.course ? data.course?.name : "No enrolled course"}
        />
        {/* <DetailRow icon={Box} label="Batch" value={data.batch} /> */}
        <DetailRow
          icon={BiMoney}
          label="Payment Type"
          value={getPaymentType(data.paymentType)}
        />
      </div>

      {hasDiscount && (
        <div className="mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
              🎁 Discount Applied
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {appliedDiscount.discountType === "PERCENTAGE" ||
              appliedDiscount.discountType === "percentage"
                ? `${appliedDiscount.discountValue}% OFF`
                : `₦${appliedDiscount.discountValue.toLocaleString()} OFF`}
            </span>
          </div>
        </div>
      )}

      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        <DetailRow
          icon={Percent}
          label="Total Fee"
          value={
            hasDiscount ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="line-through text-gray-400 dark:text-gray-500 text-sm">
                    ₦{appliedDiscount.originalAmount.toLocaleString()}
                  </span>
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    → ₦{(data.paymentPlan.amount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                  Saved ₦{discountSavings.toLocaleString()}
                </div>
              </div>
            ) : (
              `₦${(data.paymentPlan.amount || 0).toLocaleString()}`
            )
          }
          valueClassName={
            hasDiscount ? "" : "font-bold text-gray-900 dark:text-gray-100"
          }
        />
        <DetailRow
          icon={CheckCircle}
          label="Paid So Far"
          value={`₦${(data.paymentPlan.paid || "0").toLocaleString()}`}
          valueClassName="font-bold text-gray-900 dark:text-gray-100"
        />
        <DetailRow
          icon={Receipt}
          label="Balance"
          value={
            <div>
              <span className="font-extrabold text-red-600 dark:text-red-400">
                ₦{parseFloat(data.paymentPlan.pending || "0").toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  (after discount)
                </span>
              )}
            </div>
          }
          valueClassName=""
        />
      </div>
    </div>
  );
};

export const AdditionalActions = ({ data }: { data: Payment }) => {
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  if (!data || !data.paymentPlan) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
        <p className="text-gray-500 dark:text-gray-400">
          Actions not available
        </p>
      </div>
    );
  }

  // Check if payment is approved
  const isApproved =
    !!data.approvedAt ||
    data.status === "approved" ||
    data.status === "APPROVED";

  const pending = parseFloat(data.paymentPlan.pending || "0") || 0;
  const isPaid = pending === 0;

  // Priority: Approved > Paid > Pending
  let statusText = "Pending";
  let statusColor =
    "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-200";

  if (isApproved) {
    statusText = "Approved";
    statusColor =
      "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-200";
  } else if (isPaid) {
    statusText = "Paid";
    statusColor =
      "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-200";
  }

  const ActionButton = ({
    icon: Icon,
    label,
    isDestructive = false,
    isSuccess = false,
    onClick,
  }: any) => (
    <button
      className={`flex items-center w-full px-4 py-3 rounded-xl transition duration-150 ease-in-out text-sm font-medium 
        ${
          isSuccess
            ? "bg-green-500 hover:bg-green-600 text-white shadow-md"
            : isDestructive
            ? "bg-red-500 hover:bg-red-600 text-white shadow-md"
            : "text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
        }`}
      onClick={onClick}
    >
      <Icon
        className={`w-4 h-4 mr-3 ${
          isSuccess || isDestructive
            ? "text-white"
            : "text-gray-500 dark:text-gray-400"
        }`}
      />
      {label}
    </button>
  );

  const handleRefundSubmit = async (request: CreateRefundRequest) => {
    await createRefundRequestClient(request);
  };

  const handleTicketSubmit = async (ticket: CreateTicketRequest) => {
    await createTicketClient(ticket);
  };

  const handleApproveTransaction = async (notes?: string) => {
    try {
      await approveTransactionClient(data.id, notes);
      showSuccess("Transaction approved successfully");
      // Optionally refresh the page or update the transaction data
      window.location.reload();
    } catch (error: any) {
      console.error("Failed to approve transaction:", error);
      showError(error.message || "Failed to approve transaction");
      throw error;
    }
  };

  return (
    <>
      <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Additional Actions
          </h2>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${statusColor}`}
          >
            {statusText}
          </span>
        </div>

        <div className="space-y-3">
          {!isApproved && (
            <ActionButton
              icon={CheckCircle}
              label="Approve Transaction"
              isSuccess={true}
              onClick={() => setShowApprovalModal(true)}
            />
          )}
          <ActionButton
            icon={RefreshCcw}
            label="Issue Refund"
            onClick={() => setShowRefundModal(true)}
          />
          <ActionButton
            icon={Gavel}
            label="Dispute Management"
            onClick={() => setShowTicketModal(true)}
          />
        </div>
      </div>

      <RefundRequestModal
        payment={data}
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        onSubmit={handleRefundSubmit}
      />

      <CreateTicketModal
        payment={data}
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        onSubmit={handleTicketSubmit}
      />

      <TransactionApprovalModal
        payment={data}
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        onSubmit={handleApproveTransaction}
      />
    </>
  );
};

export const PayerInformation = ({ data }: Props) => {
  const PayerDetail = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-start mb-4">
      <Icon className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500 mt-1" />
      <div className="flex-grow flex justify-between">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {label}
        </span>
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200 text-right">
          {value || "N/A"}
        </span>
      </div>
    </div>
  );

  if (!data) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm mb-6">
        <p className="text-gray-500 dark:text-gray-400">
          Payer information not available
        </p>
      </div>
    );
  }

  const studentId = data.student?.id;
  const hasStudentLink = !!studentId;

  const content = (
    <div
      className={`p-6 bg-white dark:bg-gray-800 border rounded-xl shadow-sm mb-6 transition-all duration-200 ${
        hasStudentLink
          ? "border-blue-300 dark:border-blue-600 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md cursor-pointer"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2
          className={`text-xl font-semibold ${
            hasStudentLink
              ? "text-blue-700 dark:text-blue-400"
              : "text-gray-700 dark:text-gray-200"
          }`}
        >
          Payer Information
        </h2>
        {hasStudentLink && (
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-700 flex items-center gap-1">
            <User className="w-3 h-3" />
            View Student →
          </span>
        )}
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        <PayerDetail icon={User} label="Name" value={data.student?.fullName} />
        <PayerDetail icon={User} label="Relationship" value={"Student"} />
        <PayerDetail icon={Mail} label="Contact" value={data.student?.phone} />
        {data.paidBy && (
          <PayerDetail icon={User} label="Paid By" value={data.paidBy} />
        )}
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

  if (hasStudentLink) {
    return (
      <Link
        href={`/dashboard/academic/students/${studentId}`}
        className="block group"
      >
        {content}
      </Link>
    );
  }

  return content;
};

export const ProofOfPayment = ({ data }: any) => {
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const UploadedInfo = ({ uploadedBy, uploadedDate, proofStatus }: any) => (
    <div className="my-4 text-sm text-gray-600 dark:text-gray-400">
      {/* <p>
        Uploaded by
        <span className="font-semibold text-gray-800 dark:text-gray-200">{uploadedBy}</span> on{" "}
        {uploadedDate}
      </p> */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {proofStatus}
      </p>
    </div>
  );

  const SecondaryButton = ({ icon: Icon, label, onClick }: any) => (
    <button
      className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 px-3 py-2 rounded-lg transition duration-150 ease-in-out"
      onClick={onClick}
    >
      <Icon className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
      {label}
    </button>
  );

  const handleViewReceipt = () => {
    setIsReceiptOpen(true);
  };

  const handlePrintReceipt = () => {
    // Ensure receipt is open to get the content
    if (!isReceiptOpen) {
      setIsReceiptOpen(true);
      // Wait for the receipt to render, then print
      setTimeout(() => {
        printReceiptContent();
      }, 500);
    } else {
      printReceiptContent();
    }
  };

  const printReceiptContent = () => {
    const receiptElement = document.getElementById("receipt-content");
    if (!receiptElement) {
      console.error("Receipt element not found");
      return;
    }

    // Create a print-friendly version
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print the receipt.");
      return;
    }

    // Get all computed styles from the original element
    const originalStyles = window.getComputedStyle(receiptElement);
    const clonedElement = receiptElement.cloneNode(true) as HTMLElement;

    // Hide action buttons in the clone
    const actionButtons = clonedElement.querySelectorAll(".print-hidden");
    actionButtons.forEach((btn) => {
      (btn as HTMLElement).style.display = "none";
    });

    // Get the HTML content
    const htmlContent = clonedElement.innerHTML;

    // Get all stylesheets from the current document
    const stylesheets = Array.from(document.styleSheets);
    let allStyles = "";

    // Try to get styles from stylesheets (may fail due to CORS)
    stylesheets.forEach((sheet) => {
      try {
        if (sheet.cssRules) {
          Array.from(sheet.cssRules).forEach((rule) => {
            allStyles += rule.cssText + "\n";
          });
        }
      } catch (e) {
        // CORS issue, skip
      }
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payment Receipt</title>
        <meta charset="utf-8">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          ${allStyles}
          
          /* Additional print-specific styles */
          @media print {
            @page {
              margin: 0.5in;
            }
            body {
              padding: 0;
              margin: 0;
            }
            .print-hidden {
              display: none !important;
            }
            * {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
          
          /* Ensure receipt displays properly */
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            padding: 20px;
            background: white;
          }
          
          #receipt-content {
            max-width: 800px;
            margin: 0 auto;
            background: white;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `);

    printWindow.document.close();

    // Wait for Tailwind to process and content to load, then trigger print
    printWindow.onload = () => {
      // Wait longer for Tailwind CDN to process classes
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }, 1000);
    };

    // Fallback: if onload doesn't fire, try after a delay
    setTimeout(() => {
      if (printWindow.document.readyState === "complete") {
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }
    }, 1500);
  };

  const handleDownloadPDF = async () => {
    try {
      // Open receipt if not already open
      if (!isReceiptOpen) {
        setIsReceiptOpen(true);
        // Wait for the receipt to render
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const receiptElement = document.getElementById("receipt-content");
      if (!receiptElement) {
        console.error("Receipt element not found");
        return;
      }

      // Hide action buttons for PDF
      const actionButtons = receiptElement.querySelectorAll(".print-hidden");
      actionButtons.forEach((btn) => {
        (btn as HTMLElement).style.display = "none";
      });

      // Generate canvas from the receipt
      const canvas = await html2canvas(receiptElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // Restore action buttons
      actionButtons.forEach((btn) => {
        (btn as HTMLElement).style.display = "";
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
      const studentName = data.student?.fullName || "receipt";
      const sanitizedName = studentName
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();
      const filename = `payment_receipt_${sanitizedName}_${data.id}.pdf`;

      // Download PDF
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handleShareWhatsApp = async () => {
    try {
      // Open receipt if not already open
      if (!isReceiptOpen) {
        setIsReceiptOpen(true);
        // Wait for the receipt to render
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      const receiptElement = document.getElementById("receipt-content");
      if (!receiptElement) {
        console.error("Receipt element not found");
        alert("Please open the receipt first to share it.");
        return;
      }

      // Hide action buttons for PDF
      const actionButtons = receiptElement.querySelectorAll(".print-hidden");
      actionButtons.forEach((btn) => {
        (btn as HTMLElement).style.display = "none";
      });

      // Generate canvas from the receipt
      const canvas = await html2canvas(receiptElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      // Restore action buttons
      actionButtons.forEach((btn) => {
        (btn as HTMLElement).style.display = "";
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

      // Generate PDF as blob
      const pdfBlob = pdf.output("blob");
      const studentName = data.student?.fullName || "receipt";
      const sanitizedName = studentName
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();
      const filename = `payment_receipt_${sanitizedName}_${data.id}.pdf`;

      // Try to use Web Share API if available (works on mobile and some desktop browsers)
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({
          files: [new File([pdfBlob], filename, { type: "application/pdf" })],
        })
      ) {
        try {
          const file = new File([pdfBlob], filename, {
            type: "application/pdf",
          });
          await navigator.share({
            title: `Payment Receipt - ${data.student?.fullName || "Student"}`,
            text: `Payment Receipt for ${data.student?.fullName || "Student"}`,
            files: [file],
          });
          return;
        } catch (shareError) {
          // If share fails, fall through to WhatsApp Web method
          console.log("Web Share API failed, using WhatsApp Web fallback");
        }
      }

      // Fallback: Download PDF and open WhatsApp Web
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = filename;

      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL after a delay
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 100);

      // Open WhatsApp Web with a message
      const message = `Payment Receipt for ${
        data.student?.fullName || "Student"
      }\n\nPlease find the attached PDF receipt.`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://web.whatsapp.com/send?text=${encodedMessage}`;

      // Open WhatsApp Web
      window.open(whatsappUrl, "_blank");

      // Show a helpful message
      alert(
        "PDF receipt has been downloaded. Please attach it to your WhatsApp message. WhatsApp Web has been opened for you."
      );
    } catch (error) {
      console.error("Error generating PDF for WhatsApp:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <>
      <div className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-6 text-gray-700 dark:text-gray-200">
          Proof of Payment
        </h2>

        <button
          className="flex items-center justify-center w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-150 ease-in-out"
          onClick={handleViewReceipt}
        >
          <Receipt className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
          View Receipt
        </button>

        <UploadedInfo {...data} />

        <div className="flex flex-wrap gap-2 mt-4">
          <SecondaryButton
            icon={Printer}
            label="Print Receipt"
            onClick={handlePrintReceipt}
          />
          <SecondaryButton
            icon={Share}
            label="Share on WhatsApp"
            onClick={handleShareWhatsApp}
          />
          <SecondaryButton
            icon={Download}
            label="Download PDF"
            onClick={handleDownloadPDF}
          />
        </div>
      </div>

      {/* Receipt Preview Dialog */}
      <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Payment Receipt</DialogTitle>
          </DialogHeader>
          <ReceiptPreview
            data={data}
            onPrint={handlePrintReceipt}
            onDownloadPDF={handleDownloadPDF}
            onShareWhatsApp={handleShareWhatsApp}
            showActions={true}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
