"use client";
import { useState, useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getRefundsClient, approveRefundClient, rejectRefundClient, getLoggedInUserClient } from "@/lib/client-network";
import { useCenter } from "@/context/CenterContext";
import { RefundRequest, RefundStatus } from "@/types/finance/refund.interface";
import { User } from "@/types/auth/user.interface";
import NotFoundComponent from "@/components/NotFoundComponent";
import { formatDate } from "@/lib/utils";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import ApproveRefundModal from "@/components/modals/finance/ApproveRefundModal";
import RejectRefundModal from "@/components/modals/finance/RejectRefundModal";

const RefundsContent = () => {
  const { selectedCenter, isLoading: isCenterLoading, centerContext } = useCenter();
  const { user: contextUser } = useUser();
  
  // Get user from React Query (same as discounts page)
  const { data: user = contextUser as User | null } = useQuery({
    queryKey: ["user"],
    queryFn: () => getLoggedInUserClient(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
  
  const queryClient = useQueryClient();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Check if user can approve refunds (CEO, ADMIN, or Regional Manager)
  // Check role in a case-insensitive way and handle various role name formats
  const userRole = user?.role ? String(user.role).trim().toUpperCase() : "";
  const canApproveRefunds = useMemo(() => {
    return (
      userRole === "CEO" ||
      userRole === "ADMIN" ||
      userRole === "REGIONAL_MANAGER" ||
      userRole === "REGIONALMANAGER" ||
      userRole.includes("ADMIN") ||
      userRole.includes("CEO") ||
      userRole.includes("REGIONAL")
    );
  }, [userRole]);

  const centerIdForQuery = useMemo(() => {
    if (!isCenterLoading && centerContext && !centerContext.canSwitch && centerContext.currentCenterId) {
      return centerContext.currentCenterId;
    }
    return selectedCenter === "all" ? null : selectedCenter;
  }, [isCenterLoading, centerContext, selectedCenter]);

  const { data: refundsResponse, isLoading } = useQuery({
    queryKey: ["refunds", centerIdForQuery, statusFilter, searchQuery, page],
    queryFn: () => {
      return getRefundsClient(centerIdForQuery, {
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchQuery.trim() || undefined,
        page,
        limit,
      });
    },
    staleTime: 1000 * 30, // 30 seconds
    refetchOnMount: true,
    enabled: !isCenterLoading,
  });

  const refunds = refundsResponse?.data || [];
  const total = refundsResponse?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const getStatusColor = (status: RefundStatus | string) => {
    // Handle both enum and string values (backend might return strings)
    const statusUpper = typeof status === 'string' ? status.toUpperCase() : status;
    
    switch (statusUpper) {
      case RefundStatus.REQUESTED:
      case "REQUESTED":
        return "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200";
      case RefundStatus.APPROVED:
      case "APPROVED":
        return "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200";
      case RefundStatus.REJECTED:
      case "REJECTED":
        return "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200";
      case RefundStatus.COMPLETED:
      case "COMPLETED":
        return "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      STUDENT_WITHDRAWAL: "Student Withdrawal",
      COURSE_CANCELLATION: "Course Cancellation",
      PAYMENT_ERROR: "Payment Error",
      DUPLICATE_PAYMENT: "Duplicate Payment",
      SERVICE_ISSUE: "Service Issue",
      OTHER: "Other",
      // Support lowercase variants for backward compatibility
      student_withdrawal: "Student Withdrawal",
      course_cancellation: "Course Cancellation",
      payment_error: "Payment Error",
      duplicate_payment: "Duplicate Payment",
      service_issue: "Service Issue",
      other: "Other",
    };
    return labels[reason] || labels[reason.toUpperCase()] || reason;
  };

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
      return await approveRefundClient(id, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["refunds"] });
      toast.success("Refund approved successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to approve refund");
      throw error;
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ id, rejectionReason }: { id: string; rejectionReason: string }) => {
      return await rejectRefundClient(id, rejectionReason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["refunds"] });
      toast.success("Refund rejected successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to reject refund");
      throw error;
    },
  });

  const handleApproveClick = (refund: RefundRequest) => {
    setSelectedRefund(refund);
    setShowApproveModal(true);
  };

  const handleRejectClick = (refund: RefundRequest) => {
    setSelectedRefund(refund);
    setShowRejectModal(true);
  };

  const handleApprove = async (id: string, notes?: string) => {
    try {
      await approveMutation.mutateAsync({ id, notes });
      setShowApproveModal(false);
      setSelectedRefund(null);
    } catch (error) {
      // Error is handled by mutation onError
      throw error;
    }
  };

  const handleReject = async (id: string, rejectionReason: string) => {
    try {
      await rejectMutation.mutateAsync({ id, rejectionReason });
      setShowRejectModal(false);
      setSelectedRefund(null);
    } catch (error) {
      // Error is handled by mutation onError
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Refunds</h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all refund requests. CEO, ADMIN, or Regional Manager approval required for processing.
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
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1); // Reset to first page on search
                }}
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
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1); // Reset to first page on filter change
                }}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Statuses</option>
                <option value={RefundStatus.REQUESTED}>Requested</option>
                <option value={RefundStatus.APPROVED}>Approved</option>
                <option value={RefundStatus.REJECTED}>Rejected</option>
                <option value={RefundStatus.COMPLETED}>Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Refunds Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading refunds...</div>
          ) : refunds.length === 0 ? (
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
                  {refunds.map((refund: RefundRequest) => (
                    <tr key={refund.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {refund.student?.fullname || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {refund.student?.email || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {refund.payment?.course?.name || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {refund.paymentId.substring(0, 8)}...
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
                          {typeof refund.status === 'string' 
                            ? refund.status.charAt(0) + refund.status.slice(1).toLowerCase()
                            : refund.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <div>
                          {refund.requester 
                            ? `${refund.requester.firstname} ${refund.requester.lastname}`
                            : "N/A"}
                        </div>
                        {refund.requester?.email && (
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {refund.requester.email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(refund.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {refund.approver || refund.approvedBy ? (
                          <div>
                            <div className="font-medium dark:text-gray-200">
                              {refund.approver
                                ? `${refund.approver.firstname} ${refund.approver.lastname}`
                                : "N/A"}
                            </div>
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
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            title="View Payment"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          {canApproveRefunds && (refund.status === RefundStatus.REQUESTED || refund.status?.toUpperCase() === "REQUESTED") && (
                            <>
                              <button
                                onClick={() => handleApproveClick(refund)}
                                disabled={approveMutation.isPending || rejectMutation.isPending}
                                className="px-3 py-1 bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 rounded text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                title="Approve Refund"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectClick(refund)}
                                disabled={approveMutation.isPending || rejectMutation.isPending}
                                className="px-3 py-1 bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 rounded text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                title="Reject Refund"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {refund.status === RefundStatus.APPROVED && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 italic">
                              Ready to process
                            </span>
                          )}
                          {refund.status === RefundStatus.REJECTED && refund.rejectionReason && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate" title={refund.rejectionReason}>
                              {refund.rejectionReason}
                            </div>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} refunds
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Approval Modal */}
        {selectedRefund && (
          <ApproveRefundModal
            refund={selectedRefund}
            isOpen={showApproveModal}
            onClose={() => {
              setShowApproveModal(false);
              setSelectedRefund(null);
            }}
            onApprove={handleApprove}
          />
        )}

        {/* Rejection Modal */}
        {selectedRefund && (
          <RejectRefundModal
            refund={selectedRefund}
            isOpen={showRejectModal}
            onClose={() => {
              setShowRejectModal(false);
              setSelectedRefund(null);
            }}
            onReject={handleReject}
          />
        )}
      </div>
    </div>
  );
};

export default RefundsContent;