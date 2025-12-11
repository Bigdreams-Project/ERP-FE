"use client";
import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRefundsClient, approveRefundClient, rejectRefundClient } from "@/lib/client-network";
import { useCenter } from "@/context/CenterContext";
import { RefundRequest, RefundStatus } from "@/types/finance/refund.interface";
import NotFoundComponent from "@/components/NotFoundComponent";
import { formatDate } from "@/lib/utils";
import { Eye, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";

const RefundsContent = () => {
  const { selectedCenter, isLoading: isCenterLoading, centerContext } = useCenter();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");

  const isCEO = user?.role?.toUpperCase() === "CEO";

  const centerIdForQuery = useMemo(() => {
    if (!isCenterLoading && centerContext && !centerContext.canSwitch && centerContext.currentCenterId) {
      return centerContext.currentCenterId;
    }
    return selectedCenter === "all" ? null : selectedCenter;
  }, [isCenterLoading, centerContext, selectedCenter]);

  const { data: refunds = [], isLoading } = useQuery({
    queryKey: ["refunds", centerIdForQuery, statusFilter],
    queryFn: () => {
      return getRefundsClient(centerIdForQuery);
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    enabled: !isCenterLoading,
  });

  const filteredRefunds = useMemo(() => {
    let filtered = refunds;
    
    if (statusFilter !== "all") {
      filtered = filtered.filter((refund: RefundRequest) => refund.status === statusFilter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((refund: RefundRequest) =>
        refund.student?.fullName?.toLowerCase().includes(query) ||
        refund.payment?.id?.toLowerCase().includes(query) ||
        refund.requestedByName?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [refunds, statusFilter, searchQuery]);

  const getStatusColor = (status: RefundStatus) => {
    switch (status) {
      case RefundStatus.PENDING:
        return "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200";
      case RefundStatus.APPROVED:
        return "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200";
      case RefundStatus.REJECTED:
        return "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200";
      case RefundStatus.PROCESSED:
        return "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200";
      case RefundStatus.CANCELLED:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      student_withdrawal: "Student Withdrawal",
      course_cancellation: "Course Cancellation",
      payment_error: "Payment Error",
      duplicate_payment: "Duplicate Payment",
      service_issue: "Service Issue",
      other: "Other",
    };
    return labels[reason] || reason;
  };

  const handleApprove = async () => {
    if (!selectedRefund) return;
    
    try {
      await approveRefundClient(selectedRefund.id);
      toast.success("Refund approved successfully");
      setShowApproveModal(false);
      setSelectedRefund(null);
      queryClient.invalidateQueries({ queryKey: ["refunds"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to approve refund");
    }
  };

  const handleReject = async () => {
    if (!selectedRefund || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    
    try {
      await rejectRefundClient(selectedRefund.id, rejectionReason);
      toast.success("Refund rejected");
      setShowRejectModal(false);
      setSelectedRefund(null);
      setRejectionReason("");
      queryClient.invalidateQueries({ queryKey: ["refunds"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to reject refund");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Refunds</h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all refund requests. CEO approval required for processing.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name, payment ID, or requester..."
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Statuses</option>
                <option value={RefundStatus.PENDING}>Pending</option>
                <option value={RefundStatus.APPROVED}>Approved</option>
                <option value={RefundStatus.REJECTED}>Rejected</option>
                <option value={RefundStatus.PROCESSED}>Processed</option>
                <option value={RefundStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Refunds Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading refunds...</div>
          ) : filteredRefunds.length === 0 ? (
            <NotFoundComponent text="Refunds" setIsModalOpen={() => {}} showButton={false} />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Requested By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Requested At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Approved By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRefunds.map((refund: RefundRequest) => (
                    <tr key={refund.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {refund.student?.fullName || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {refund.student?.studentId || refund.student?.id || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {refund.payment?.course?.name || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {refund.paymentId.substring(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        ₦{refund.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {getReasonLabel(refund.reason)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            refund.status
                          )}`}
                        >
                          {refund.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {refund.requestedByName || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(refund.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {refund.approvedByName || refund.approvedBy ? (
                          <div>
                            <div className="font-medium dark:text-gray-200">{refund.approvedByName || "N/A"}</div>
                            {refund.approvedAt && (
                              <div className="text-xs text-gray-400 dark:text-gray-500">
                                {formatDate(refund.approvedAt)}
                              </div>
                            )}
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/dashboard/finance/banking/transactions/${refund.paymentId}`)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          {isCEO && refund.status === RefundStatus.PENDING && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedRefund(refund);
                                  setShowApproveModal(true);
                                }}
                                className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 flex items-center gap-1"
                              >
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedRefund(refund);
                                  setShowRejectModal(true);
                                }}
                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 flex items-center gap-1"
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Approve Modal */}
        {showApproveModal && selectedRefund && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Approve Refund</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to approve this refund request of ₦
                {selectedRefund.amount.toLocaleString()} for{" "}
                {selectedRefund.student?.fullName}?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowApproveModal(false);
                    setSelectedRefund(null);
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && selectedRefund && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Reject Refund</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to reject this refund request of ₦
                {selectedRefund.amount.toLocaleString()} for{" "}
                {selectedRefund.student?.fullName}?
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rejection Reason <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                  placeholder="Please provide a reason for rejection..."
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedRefund(null);
                    setRejectionReason("");
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RefundsContent;

