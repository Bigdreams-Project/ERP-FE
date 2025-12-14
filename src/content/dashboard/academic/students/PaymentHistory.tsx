"use client";

import { Student } from "@/types/academic/student.interface";
import Card from "./Card";
import { Payment } from "@/types/finance/payment.interface";
import { formatDate } from "@/lib/utils";
import { getPaymentPlan } from "@/components/academic/utils/payment";
import { useState } from "react";
import { Eye, Download, Printer, X } from "lucide-react";
import { ImSpinner2 } from "react-icons/im";
import { ReceiptPreview } from "@/content/dashboard/finance/banking/transactions/ReceiptPreview";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Props {
  data: Student;
}

const PaymentHistory = ({ data }: Props) => {
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showAllPaymentsModal, setShowAllPaymentsModal] = useState(false);

  // Sort payments by date (most recent first)
  const sortedPayments = data.payments
    ? [...data.payments].sort(
        (a, b) => {
          const dateA = a.paymentDate || a.createdAt || "";
          const dateB = b.paymentDate || b.createdAt || "";
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        }
      )
    : [];

  // Show only first 2 payments in main view
  const recentPayments = sortedPayments.slice(0, 2);
  const allPayments = sortedPayments;


  // Helper to ensure payment has student data
  const enrichPaymentWithStudent = (payment: Payment): Payment => {
    if (!payment.student && data) {
      return {
        ...payment,
        student: data,
      };
    }
    return payment;
  };

  // Receipt handlers
  const handleViewReceipt = (payment: Payment) => {
    const enrichedPayment = enrichPaymentWithStudent(payment);
    setSelectedPayment(enrichedPayment);
    setIsReceiptOpen(true);
  };

  const handlePrintReceipt = (payment: Payment) => {
    const enrichedPayment = enrichPaymentWithStudent(payment);
    setSelectedPayment(enrichedPayment);
    setIsReceiptOpen(true);
    setIsPrinting(true);
    // Wait for the receipt to render, then print
    setTimeout(() => {
      printReceiptContent();
      setIsPrinting(false);
    }, 500);
  };

  const printReceiptContent = () => {
    const receiptElement = document.getElementById("receipt-content");
    if (!receiptElement) {
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print the receipt.");
      return;
    }

    const clonedElement = receiptElement.cloneNode(true) as HTMLElement;

    // Hide action buttons in the clone
    const actionButtons = clonedElement.querySelectorAll(".print-hidden");
    actionButtons.forEach((btn) => {
      (btn as HTMLElement).style.display = "none";
    });

    const htmlContent = clonedElement.innerHTML;

    // Get all stylesheets from the current document
    const stylesheets = Array.from(document.styleSheets);
    let allStyles = "";

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

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      }, 1000);
    };

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

  const handleDownloadPDF = async (payment: Payment) => {
    try {
      setIsDownloadingPDF(true);
      const enrichedPayment = enrichPaymentWithStudent(payment);
      setSelectedPayment(enrichedPayment);
      setIsReceiptOpen(true);
      // Wait for the receipt to render
      await new Promise((resolve) => setTimeout(resolve, 500));

      const receiptElement = document.getElementById("receipt-content");
      if (!receiptElement) {
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
      const studentName = payment.student?.fullName || data.fullName || "receipt";
      const sanitizedName = studentName
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();
      const filename = `payment_receipt_${sanitizedName}_${payment.id}.pdf`;

      // Download PDF
      pdf.save(filename);
      setIsDownloadingPDF(false);
    } catch (error) {
      alert("Failed to generate PDF. Please try again.");
      setIsDownloadingPDF(false);
    }
  };

  return (
    <>
      <Card title="Payment History">
        <div className="space-y-4">
          {recentPayments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No payment history available
            </p>
          ) : (
            recentPayments.map((payment: Payment) => {
              const isPaid =
                !payment.paymentPlan?.pending ||
                payment.paymentPlan.pending === "0" ||
                (payment.paymentPlan?.pending &&
                  isNaN(Number(payment.paymentPlan.pending)));

              return (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-indigo-50 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col flex-1">
                    <span className="font-semibold text-gray-800 dark:text-gray-200 text-base mb-1">
                      Payment on {formatDate(payment.paymentDate || payment.createdAt)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      {isPaid
                        ? "Full Payment"
                        : `Partial Payment (Pending: ₦${Number(
                            payment.paymentPlan?.pending || 0
                          ).toLocaleString()})`}
                    </span>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Plan: {payment.paymentPlan?.name ? getPaymentPlan(payment.paymentPlan.name) : "N/A"}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                        ID: {payment.id}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                      ₦{payment.amount.toLocaleString()}
                    </span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleViewReceipt(payment)}
                        className="p-2.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg transition-colors"
                        title="View Receipt"
                        aria-label="View Receipt"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(payment)}
                        disabled={isDownloadingPDF}
                        className="p-2.5 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Download PDF"
                        aria-label="Download PDF"
                      >
                        {isDownloadingPDF ? (
                          <ImSpinner2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Download className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => handlePrintReceipt(payment)}
                        disabled={isPrinting}
                        className="p-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Print Receipt"
                        aria-label="Print Receipt"
                      >
                        {isPrinting ? (
                          <ImSpinner2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Printer className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {allPayments.length > 2 && (
          <button
            onClick={() => setShowAllPaymentsModal(true)}
            className="mt-4 w-full px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-500 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors"
          >
            View All Payments ({allPayments.length})
          </button>
        )}
      </Card>

      {/* All Payments Modal */}
      {showAllPaymentsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4 font-sans">
          <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                Payment History - {data.fullName}
              </h2>
              <button
                onClick={() => setShowAllPaymentsModal(false)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Payments List */}
            <div className="flex-1 overflow-y-auto p-6">
              {allPayments.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No payment history available
                </p>
              ) : (
                <div className="space-y-3">
                  {allPayments.map((payment: Payment) => {
                    const isPaid =
                      !payment.paymentPlan?.pending ||
                      payment.paymentPlan.pending === "0" ||
                      (payment.paymentPlan?.pending &&
                        isNaN(Number(payment.paymentPlan.pending)));

                    return (
                      <div
                        key={payment.id}
                        className="flex items-center justify-between p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:bg-indigo-50 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex flex-col flex-1">
                          <span className="font-semibold text-gray-800 dark:text-gray-200 text-base mb-1">
                            Payment on {formatDate(payment.paymentDate || payment.createdAt)}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            {isPaid
                              ? "Full Payment"
                              : `Partial Payment (Pending: ₦${Number(
                                  payment.paymentPlan?.pending || 0
                                ).toLocaleString()})`}
                          </span>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Plan: {payment.paymentPlan?.name ? getPaymentPlan(payment.paymentPlan.name) : "N/A"}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                              ID: {payment.id}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-6">
                          <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                            ₦{payment.amount.toLocaleString()}
                          </span>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleViewReceipt(payment)}
                              className="p-2.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-lg transition-colors"
                              title="View Receipt"
                              aria-label="View Receipt"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDownloadPDF(payment)}
                              disabled={isDownloadingPDF}
                              className="p-2.5 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Download PDF"
                              aria-label="Download PDF"
                            >
                              {isDownloadingPDF ? (
                                <ImSpinner2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <Download className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              onClick={() => handlePrintReceipt(payment)}
                              disabled={isPrinting}
                              className="p-2.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Print Receipt"
                              aria-label="Print Receipt"
                            >
                              {isPrinting ? (
                                <ImSpinner2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <Printer className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Receipt Preview Dialog */}
      {selectedPayment && (
        <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="sr-only">Payment Receipt</DialogTitle>
            </DialogHeader>
            <ReceiptPreview
              data={selectedPayment}
              onPrint={() => {
                if (selectedPayment) {
                  handlePrintReceipt(selectedPayment);
                }
              }}
              onDownloadPDF={() => {
                if (selectedPayment) {
                  handleDownloadPDF(selectedPayment);
                }
              }}
              showActions={true}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default PaymentHistory;
