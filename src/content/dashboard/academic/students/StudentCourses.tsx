"use client";

import AddPaymentModal from "@/components/modals/academic/AddPaymentModal";
import DiscountRequestModal from "@/components/modals/finance/DiscountRequestModal";
import DiscountApprovalModal from "@/components/modals/finance/DiscountApprovalModal";
import { getStudentCourses } from "@/lib/network";
import { createDiscountRequestClient, getDiscountsClient } from "@/lib/client-network";
import { formatDate } from "@/lib/utils";
import { Student } from "@/types/academic/student.interface";
import { CreateDiscountRequest, DiscountRequest } from "@/types/finance/discount.interface";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { getLoggedInUserClient } from "@/lib/client-network";
import { User } from "@/types/auth/user.interface";
import Card from "./Card";
import InfoItem from "./InfoItem";

interface Props {
  data: Student;
}

const StudentCourses = ({ data }: Props) => {
  const queryClient = useQueryClient();
  const { user: contextUser } = useUser();
  
  // Get user from React Query (same as useIsAdmin hook) to ensure we have the correct role
  const { data: user = contextUser as User | null } = useQuery({
    queryKey: ["user"],
    queryFn: () => getLoggedInUserClient(),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [selectedPendingDiscount, setSelectedPendingDiscount] = useState<DiscountRequest | null>(null);
  
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
  console.log("[StudentCourses] User role check:", {
    userRole,
    rawRole: user?.role,
    roleType: typeof user?.role,
    canApproveDiscounts,
    user: user ? { id: user.id, role: user.role, fullUser: user } : null,
  });

  // Fetch all discounts for this student (for approval and to check if discount exists)
  const { data: allStudentDiscounts = [] } = useQuery({
    queryKey: ["student-discounts", data.id],
    queryFn: async () => {
      const allDiscounts = await getDiscountsClient(null);
      return allDiscounts.filter(
        (d: DiscountRequest) => d.studentId === data.id
      );
    },
    enabled: !!data.id,
    staleTime: 1000 * 30,
  });

  // Separate pending discounts for approval UI
  const pendingDiscounts = allStudentDiscounts.filter(
    (d: DiscountRequest) =>
      d.status === "pending" || d.status === "PENDING" || !d.status
  );

  // Use React Query for automatic cache management and refresh
  const { data: courses = [], isLoading: loading, refetch } = useQuery({
    queryKey: ["student-courses", data.id],
    queryFn: async () => {
      const response = await getStudentCourses(data.id);
      const formattedCourses = response.map((item: any) => item);
      
      // Debug: Log payment plan structure to see if discountRequests are included
      formattedCourses.forEach((course: any) => {
        if (course.paymentPlan) {
          console.log("Payment Plan for", course.course.name, ":", {
            amount: course.paymentPlan.amount,
            pending: course.paymentPlan.pending,
            discountRequests: course.paymentPlan.discountRequests,
            hasDiscount: course.paymentPlan.hasDiscount,
            discountTag: course.paymentPlan.discountTag,
            originalAmount: course.paymentPlan.originalAmount,
            fullPaymentPlan: course.paymentPlan,
          });
        }
      });
      
      return formattedCourses;
    },
    staleTime: 1000 * 30, // Consider stale after 30 seconds
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  if (loading) {
    return (
      <Card title="Courses" className="h-full">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Loading courses...
        </p>
      </Card>
    );
  }

  return (
    <Card 
      title={
        <div className="flex items-center justify-between">
          <span>Courses</span>
          <button
            onClick={() => refetch()}
            className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            title="Refresh courses"
            aria-label="Refresh courses"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      }
      className="h-full"
    >
      {courses.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          No courses enrolled yet.
        </p>
      ) : (
        <div className="space-y-4">
          {courses.map((course: any) => {
            // Check if course is fully paid (pending <= 0)
            const isFullyPaid = course?.paymentPlan 
              ? course.paymentPlan.pending <= 0 
              : false;

            // Get applied discount if any
            const appliedDiscount = course?.paymentPlan?.discountRequests?.find(
              (d: any) => d.status === "APPLIED" || d.status === "applied"
            );
            const hasDiscount = !!appliedDiscount;

            // Get all discounts for this course
            const courseDiscounts = allStudentDiscounts.filter(
              (d: DiscountRequest) => d.courseId === course.course.id
            );
            
            // Find pending discount for this course
            const pendingDiscount = courseDiscounts.find(
              (d: DiscountRequest) => 
                d.status === "pending" || 
                d.status === "PENDING" || 
                !d.status
            );
            
            // Check if discount has been approved, rejected, or applied (not pending)
            const hasApprovedOrRejectedDiscount = courseDiscounts.some(
              (d: DiscountRequest) => {
                const status = String(d.status || "").toUpperCase();
                return status === "APPROVED" || 
                       status === "REJECTED" || 
                       status === "APPLIED" ||
                       status === "CANCELLED";
              }
            ) || hasDiscount;

            // Calculate discount savings
            const discountSavings = appliedDiscount
              ? appliedDiscount.originalAmount - appliedDiscount.discountedAmount
              : 0;

            return (
              <div
                key={course.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm bg-white dark:bg-gray-800"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                      {course.course.name}
                    </h3>
                    {hasDiscount && (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center gap-1">
                        <span>🎁</span>
                        {appliedDiscount.discountType === "PERCENTAGE" || appliedDiscount.discountType === "percentage"
                          ? `${appliedDiscount.discountValue}% OFF`
                          : `₦${appliedDiscount.discountValue.toLocaleString()} OFF`}
                      </span>
                    )}
                    {pendingDiscount && canApproveDiscounts && (
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 flex items-center gap-1">
                        <span>⏳</span>
                        Pending Approval
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    {!isFullyPaid && (
                      <>
                        {/* Only show "Offer Discount" if no discount has been approved or rejected */}
                        {!hasApprovedOrRejectedDiscount && (
                          <button
                            onClick={() =>
                              setSelectedCourse({
                                course: course,
                                action: "discount",
                              })
                            }
                            className="bg-indigo-600 dark:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-sm hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
                          >
                            Offer Discount
                          </button>
                        )}
                        <button
                          onClick={() =>
                            setSelectedCourse({ course: course, action: "payment" })
                          }
                          className="bg-blue-600 dark:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                        >
                          Add Payment
                        </button>
                      </>
                    )}
                    {pendingDiscount && canApproveDiscounts && (
                      <button
                        onClick={() => setSelectedPendingDiscount(pendingDiscount)}
                        className="bg-yellow-600 dark:bg-yellow-700 text-white px-3 py-1.5 rounded-md text-sm hover:bg-yellow-700 dark:hover:bg-yellow-600 transition flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Review Discount
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-x-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Total Fee
                    </label>
                    {hasDiscount ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                            ₦{appliedDiscount.originalAmount.toLocaleString()}
                          </span>
                          <span className="text-base font-semibold text-gray-800 dark:text-gray-200">
                            → ₦{course?.paymentPlan?.amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                          Saved ₦{discountSavings.toLocaleString()}
                        </div>
                      </div>
                    ) : (
                      <span className="text-base font-semibold text-gray-800 dark:text-gray-200">
                        {course?.paymentPlan
                          ? `₦${course?.paymentPlan.amount.toLocaleString()}`
                          : "N/A"}
                      </span>
                    )}
                  </div>
                  <InfoItem
                    label="Amount Paid"
                    value={
                      course?.paymentPlan
                        ? `₦${course?.paymentPlan.paid.toLocaleString()}`
                        : "N/A"
                    }
                    valueColor="text-green-600 dark:text-green-400"
                  />
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Balance Due
                    </label>
                    <div>
                      <span
                        className={
                          course?.paymentPlan && course.paymentPlan.pending <= 0
                            ? "text-base font-semibold text-green-600 dark:text-green-400"
                            : "text-base font-semibold text-red-600 dark:text-red-400"
                        }
                      >
                        {course?.paymentPlan
                          ? course.paymentPlan.pending <= 0
                            ? "Fully Paid"
                            : `₦${course.paymentPlan.pending.toLocaleString()}`
                          : "N/A"}
                      </span>
                      {hasDiscount && course?.paymentPlan && course.paymentPlan.pending > 0 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          (after discount)
                        </span>
                      )}
                    </div>
                  </div>
                  <InfoItem
                    label="Next Payment Due"
                    value={
                      course?.paymentPlan?.nextPaymentDate
                        ? formatDate(course.paymentPlan.nextPaymentDate)
                        : "N/A"
                    }
                    valueColor="text-gray-700 dark:text-gray-300"
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedCourse && selectedCourse.action === "payment" && (
        <AddPaymentModal
          course={selectedCourse.course}
          paymentPlan={selectedCourse.course.paymentPlan}
          studentId={data.id}
          onClose={() => setSelectedCourse(null)}
        />
      )}

      {selectedCourse && selectedCourse.action === "discount" && (
        <DiscountRequestModal
          studentId={data.id}
          course={selectedCourse.course.course}
          paymentPlan={selectedCourse.course.paymentPlan}
          isOpen={true}
          onClose={() => {
            setSelectedCourse(null);
            // Refresh courses after closing modal to show updated amounts
            queryClient.invalidateQueries({ queryKey: ["student-courses", data.id] });
            refetch();
          }}
          onSubmit={async (request: CreateDiscountRequest) => {
            try {
              // Submit the discount request
              await createDiscountRequestClient(request);
              
              // Invalidate and refetch courses to show updated payment plan
              queryClient.invalidateQueries({ queryKey: ["student-courses", data.id] });
              await refetch();
            } catch (error) {
              console.error("Error applying discount:", error);
              throw error; // Re-throw to let the modal handle the error
            }
          }}
        />
      )}

      {/* Discount Approval Modal */}
      {selectedPendingDiscount && (
        <DiscountApprovalModal
          discount={selectedPendingDiscount}
          isOpen={!!selectedPendingDiscount}
          onClose={() => {
            setSelectedPendingDiscount(null);
          }}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["student-courses", data.id] });
            queryClient.invalidateQueries({ queryKey: ["student-pending-discounts", data.id] });
            queryClient.invalidateQueries({ queryKey: ["discounts"] });
            setSelectedPendingDiscount(null);
          }}
        />
      )}
    </Card>
  );
};

export default StudentCourses;
