"use client";
import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  getDiscountsClient, 
  approveDiscountClient, 
  rejectDiscountClient,
  getLoggedInUserClient
} from "@/lib/client-network";
import { useCenter } from "@/context/CenterContext";
import { DiscountRequest, DiscountStatus, DiscountType } from "@/types/finance/discount.interface";
import { User } from "@/types/auth/user.interface";
import NotFoundComponent from "@/components/NotFoundComponent";
import { formatDate } from "@/lib/utils";
import { Eye, CheckCircle, XCircle, Clock, Percent } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";

const DiscountsContent = () => {
  const { selectedCenter, isLoading: isCenterLoading, centerContext } = useCenter();
  const { user: contextUser } = useUser();
  
  // Get user from React Query (same as useIsAdmin hook)
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
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<DiscountRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");

  // Roles that can approve discounts: CEO, Regional Manager, Admin
  // Check role in a case-insensitive way and handle various role name formats
  const userRole = user?.role ? String(user.role).trim().toUpperCase() : "";
  const canApproveDiscounts = 
    userRole === "CEO" || 
    userRole === "ADMIN" || 
    userRole === "REGIONAL_MANAGER" ||
    userRole === "REGIONALMANAGER" ||
    userRole.includes("ADMIN") ||
    userRole.includes("CEO") ||
    userRole.includes("REGIONAL");

  // Debug logging
  const centerIdForQuery = useMemo(() => {
    if (!isCenterLoading && centerContext && !centerContext.canSwitch && centerContext.currentCenterId) {
      return centerContext.currentCenterId;
    }
    return selectedCenter === "all" ? null : selectedCenter;
  }, [isCenterLoading, centerContext, selectedCenter]);

  const { data: discounts = [], isLoading, error, isError } = useQuery({
    queryKey: ["discounts", centerIdForQuery],
    queryFn: async () => {
      try {
        const result = await getDiscountsClient(centerIdForQuery);
        return result;
      } catch (err: any) {
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    enabled: !isCenterLoading,
    retry: 1,
  });

  const filteredDiscounts = useMemo(() => {
    let filtered = discounts;
    
    if (statusFilter !== "all") {
      // Normalize status comparison (handle case differences and null/undefined)
      // If status is null/undefined, treat it as "pending" for filtering purposes
      filtered = filtered.filter((discount: DiscountRequest) => {
        const discountStatus = discount.status 
          ? (typeof discount.status === 'string' ? discount.status.toLowerCase() : discount.status)
          : "pending"; // Default to pending if status is missing
        const filterStatus = statusFilter.toLowerCase();
        return discountStatus === filterStatus;
      });
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((discount: DiscountRequest) =>
        discount.student?.fullName?.toLowerCase().includes(query) ||
        discount.course?.name?.toLowerCase().includes(query) ||
        discount.requestedByName?.toLowerCase().includes(query) ||
        discount.reason?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [discounts, statusFilter, searchQuery]);

  const getStatusColor = (status: DiscountStatus | string | null | undefined) => {
    if (!status) {
      return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
    
    const normalizedStatus = typeof status === 'string' ? status.toLowerCase() : status;
    
    switch (normalizedStatus) {
      case DiscountStatus.PENDING:
      case "pending":
        return "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-200";
      case DiscountStatus.APPROVED:
      case "approved":
        return "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200";
      case DiscountStatus.REJECTED:
      case "rejected":
        return "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-200";
      case DiscountStatus.APPLIED:
      case "applied":
        return "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-200";
      case DiscountStatus.CANCELLED:
      case "cancelled":
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200";
    }
  };
  
  const normalizeStatus = (status: DiscountStatus | string | null | undefined): string => {
    if (!status) return "Unknown";
    const normalized = typeof status === 'string' ? status.toLowerCase() : status;
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  const handleApprove = async () => {
    if (!selectedDiscount) return;
    
    try {
      await approveDiscountClient(selectedDiscount.id);
      toast.success("Discount approved successfully and applied to payment plan");
      setShowApproveModal(false);
      setSelectedDiscount(null);
      
      // Invalidate all relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", selectedDiscount.studentId] });
      queryClient.invalidateQueries({ queryKey: ["student-courses", selectedDiscount.studentId] });
      
      // If user is on student enrollment page, they should see the update
      // The page will automatically refresh when they navigate or the query refetches
    } catch (error: any) {
      toast.error(error.message || "Failed to approve discount");
    }
  };

  const handleReject = async () => {
    if (!selectedDiscount || !rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    
    try {
      await rejectDiscountClient(selectedDiscount.id, rejectionReason);
      toast.success("Discount rejected");
      setShowRejectModal(false);
      setSelectedDiscount(null);
      setRejectionReason("");
      queryClient.invalidateQueries({ queryKey: ["discounts"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to reject discount");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Discount Requests</h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage all discount requests. CEO, Regional Manager, or Admin approval required for processing.
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
                placeholder="Search by student name, course, or requester..."
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
                <option value={DiscountStatus.PENDING}>Pending</option>
                <option value={DiscountStatus.APPROVED}>Approved</option>
                <option value={DiscountStatus.APPLIED}>Applied</option>
                <option value={DiscountStatus.REJECTED}>Rejected</option>
                <option value={DiscountStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Discounts Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              Loading discount requests...
              {isCenterLoading && (
                <div className="text-xs mt-2 text-gray-400">Waiting for center context...</div>
              )}
            </div>
          ) : isError ? (
            <div className="p-8 text-center">
              <div className="text-red-600 dark:text-red-400 mb-2 font-semibold">
                Error loading discounts
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {error instanceof Error ? error.message : "Unknown error occurred"}
              </div>
              <button
                onClick={() => queryClient.refetchQueries({ queryKey: ["discounts"] })}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
              >
                Retry
              </button>
            </div>
          ) : filteredDiscounts.length === 0 ? (
            <NotFoundComponent text="Discount Requests" setIsModalOpen={() => {}} showButton={false} />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Discount Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Original Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Discounted Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Savings
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
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredDiscounts.map((discount: DiscountRequest) => {
                    const savings = discount.originalAmount - discount.discountedAmount;
                    return (
                      <tr key={discount.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {discount.student?.fullName || "N/A"}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {discount.student?.studentId || discount.student?.id || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-gray-100">
                            {discount.course?.name || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-gray-100">
                            {(discount.discountType === DiscountType.PERCENTAGE || (typeof discount.discountType === 'string' && discount.discountType.toUpperCase() === 'PERCENTAGE')) ? (
                              <>
                                <Percent className="w-4 h-4" />
                                {discount.discountValue}%
                              </>
                            ) : (
                              <>
                                ₦{discount.discountValue.toLocaleString()}
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 line-through">
                          ₦{discount.originalAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                          ₦{discount.discountedAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                          ₦{savings.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              discount.status
                            )}`}
                          >
                            {normalizeStatus(discount.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {discount.requestedByName || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(discount.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => router.push(`/dashboard/academic/students/enrollment/${discount.studentId}`)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-1"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                            {canApproveDiscounts && (discount.status === DiscountStatus.PENDING || 
                              (typeof discount.status === 'string' && discount.status.toLowerCase() === 'pending')) && (
                              <>
                                <button
                                  onClick={() => {
                                    setSelectedDiscount(discount);
                                    setShowApproveModal(true);
                                  }}
                                  className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 flex items-center gap-1"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedDiscount(discount);
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Approve Modal */}
        {showApproveModal && selectedDiscount && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Approve Discount</h3>
              <div className="mb-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <p>
                  <strong>Student:</strong> {selectedDiscount.student?.fullName}
                </p>
                <p>
                  <strong>Course:</strong> {selectedDiscount.course?.name}
                </p>
                <p>
                  <strong>Original Amount:</strong> ₦{selectedDiscount.originalAmount.toLocaleString()}
                </p>
                <p>
                  <strong>Discounted Amount:</strong> ₦{selectedDiscount.discountedAmount.toLocaleString()}
                </p>
                <p>
                  <strong>Savings:</strong> ₦{(selectedDiscount.originalAmount - selectedDiscount.discountedAmount).toLocaleString()}
                </p>
                <p>
                  <strong>Reason:</strong> {selectedDiscount.reason}
                </p>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to approve this discount request? This will immediately apply the discount to the student's payment plan.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowApproveModal(false);
                    setSelectedDiscount(null);
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
        {showRejectModal && selectedDiscount && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Reject Discount</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Are you sure you want to reject this discount request for{" "}
                {selectedDiscount.student?.fullName}?
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
                    setSelectedDiscount(null);
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

export default DiscountsContent;

