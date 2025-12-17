"use client";
import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  getTicketClient,
  updateTicketClient,
  getUserClient,
} from "@/lib/client-network";
import {
  Ticket,
  TicketStatus,
  TicketPriority,
  TicketCategory,
  UpdateTicketRequest,
} from "@/types/support/ticket.interface";
import { User } from "@/types/auth/user.interface";
import TicketComments from "@/components/support/TicketComments";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Clock,
  User as UserIcon,
  Calendar,
  Tag,
  FileText,
} from "lucide-react";

interface TicketDetailsProps {
  ticketId: string;
}

const TicketDetails = ({ ticketId }: TicketDetailsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [resolutionText, setResolutionText] = useState("");

  // Fetch ticket
  const {
    data: ticket,
    isLoading: isLoadingTicket,
    error: ticketError,
  } = useQuery<Ticket>({
    queryKey: ["ticket", ticketId],
    queryFn: () => getTicketClient(ticketId),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch creator user
  const {
    data: creatorUser,
    isLoading: isLoadingCreator,
    error: creatorError,
  } = useQuery<User>({
    queryKey: ["user", ticket?.createdBy],
    queryFn: () => getUserClient(ticket!.createdBy),
    enabled: !!ticket?.createdBy && !ticket?.createdByName,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
    retry: 1,
  });

  // Fetch assigned user
  const {
    data: assignedUser,
    isLoading: isLoadingAssigned,
    error: assignedError,
  } = useQuery<User>({
    queryKey: ["user", ticket?.assignedTo],
    queryFn: () => getUserClient(ticket!.assignedTo!),
    enabled: !!ticket?.assignedTo && !ticket?.assignedToName,
    staleTime: 1000 * 60 * 10, // Cache for 10 minutes
    retry: 1,
  });

  // Get creator name
  const getCreatorName = () => {
    if (ticket?.createdByName) {
      return ticket.createdByName;
    }
    if (creatorUser) {
      return `${creatorUser.firstname} ${creatorUser.lastname}`.trim();
    }
    if (creatorError) {
      return `User ID: ${ticket?.createdBy}`;
    }
    if (isLoadingCreator) {
      return "Loading...";
    }
    return "Unknown";
  };

  // Get assigned user name
  const getAssignedUserName = () => {
    if (ticket?.assignedToName) {
      return ticket.assignedToName;
    }
    if (assignedUser) {
      return `${assignedUser.firstname} ${assignedUser.lastname}`.trim();
    }
    if (assignedError) {
      return `User ID: ${ticket?.assignedTo}`;
    }
    if (isLoadingAssigned) {
      return "Loading...";
    }
    return null;
  };

  // Update ticket mutation
  const updateTicketMutation = useMutation({
    mutationFn: (payload: UpdateTicketRequest) =>
      updateTicketClient(ticketId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast.success("Ticket updated successfully");
      setIsUpdating(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update ticket");
      setIsUpdating(false);
    },
  });


  const handleStatusChange = (newStatus: TicketStatus) => {
    // If changing to RESOLVED, show modal for resolution message
    if (newStatus === TicketStatus.RESOLVED) {
      setShowResolutionModal(true);
      return;
    }
    setIsUpdating(true);
    updateTicketMutation.mutate({ status: newStatus });
  };

  const handleResolveWithMessage = () => {
    setIsUpdating(true);
    setShowResolutionModal(false);
    updateTicketMutation.mutate({
      status: TicketStatus.RESOLVED,
      resolution: resolutionText || undefined,
    });
    setResolutionText("");
  };

  const handlePriorityChange = (newPriority: TicketPriority) => {
    setIsUpdating(true);
    updateTicketMutation.mutate({ priority: newPriority });
  };


  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case TicketStatus.IN_PROGRESS:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case TicketStatus.RESOLVED:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case TicketStatus.CLOSED:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      case TicketStatus.CANCELLED:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.LOW:
        return "text-green-600 dark:text-green-400";
      case TicketPriority.MEDIUM:
        return "text-yellow-600 dark:text-yellow-400";
      case TicketPriority.HIGH:
        return "text-orange-600 dark:text-orange-400";
      case TicketPriority.URGENT:
        return "text-red-600 dark:text-red-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getCategoryLabel = (category: TicketCategory) => {
    const labels: Record<TicketCategory, string> = {
      [TicketCategory.PAYMENT_ISSUE]: "Payment Issue",
      [TicketCategory.ENROLLMENT_ISSUE]: "Enrollment Issue",
      [TicketCategory.TECHNICAL_ISSUE]: "Technical Issue",
      [TicketCategory.REFUND_REQUEST]: "Refund Request",
      [TicketCategory.ACCOUNT_ISSUE]: "Account Issue",
      [TicketCategory.OTHER]: "Other",
    };
    return labels[category] || category;
  };

  if (isLoadingTicket) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading ticket...</div>
      </div>
    );
  }

  if (ticketError || !ticket) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 mb-4">
            Failed to load ticket
          </div>
          <button
            onClick={() => router.push("/dashboard/settings/tickets")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Tickets
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push("/dashboard/settings/tickets")}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tickets
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {ticket.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Created {formatDate(ticket.createdAt)}
                </span>
                {ticket.updatedAt !== ticket.createdAt && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Updated {formatDate(ticket.updatedAt)}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                  ticket.status
                )}`}
              >
                {ticket.status.replace("_", " ").charAt(0) + ticket.status.replace("_", " ").slice(1).toLowerCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Details Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Description
                  </label>
                  <p className="mt-1 text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                    {ticket.description}
                  </p>
                </div>

                {ticket.resolution && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Resolution
                    </label>
                    <p className="mt-1 text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                      {ticket.resolution}
                    </p>
                    {ticket.resolvedAt && ticket.resolvedByName && (
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Resolved by {ticket.resolvedByName} on{" "}
                        {formatDate(ticket.resolvedAt)}
                      </p>
                    )}
                  </div>
                )}

                {ticket.attachments && ticket.attachments.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Attachments
                    </label>
                    <div className="mt-2 space-y-2">
                      {ticket.attachments.map((attachment, index) => (
                        <a
                          key={index}
                          href={attachment}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <FileText className="w-4 h-4" />
                          {attachment.split("/").pop()}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <TicketComments ticketId={ticketId} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Ticket Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Status
                  </label>
                  {isUpdating ? (
                    <div className="mt-1 text-sm text-gray-500">Updating...</div>
                  ) : (
                    <select
                      value={ticket.status}
                      onChange={(e) =>
                        handleStatusChange(e.target.value as TicketStatus)
                      }
                      className="mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                      {Object.values(TicketStatus).map((status) => (
                        <option key={status} value={status}>
                          {status.replace("_", " ").charAt(0) + status.replace("_", " ").slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Priority
                  </label>
                  {isUpdating ? (
                    <div className="mt-1 text-sm text-gray-500">Updating...</div>
                  ) : (
                    <select
                      value={ticket.priority}
                      onChange={(e) =>
                        handlePriorityChange(e.target.value as TicketPriority)
                      }
                      className={`mt-1 w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${getPriorityColor(
                        ticket.priority
                      )}`}
                    >
                      {Object.values(TicketPriority).map((priority) => (
                        <option key={priority} value={priority}>
                          {priority.charAt(0) + priority.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Category
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-gray-100">
                      {getCategoryLabel(ticket.category)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Created By
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-gray-100">
                      {getCreatorName()}
                    </span>
                  </div>
                </div>

                {(ticket.assignedTo || getAssignedUserName()) && (
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Assigned To
                    </label>
                    <div className="mt-1 flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-gray-100">
                        {getAssignedUserName() || "Unassigned"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Related Information */}
            {(ticket.payment || ticket.student) && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Related Information
                </h2>
                <div className="space-y-4">
                  {ticket.payment && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Related Payment
                      </label>
                      <div className="mt-1">
                        <p className="text-gray-900 dark:text-gray-100">
                          Amount: ₦{ticket.payment.amount.toLocaleString()}
                        </p>
                        {ticket.payment.student && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Student: {ticket.payment.student.fullName}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {ticket.student && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Related Student
                      </label>
                      <div className="mt-1">
                        <p className="text-gray-900 dark:text-gray-100">
                          {ticket.student.fullName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {ticket.student.email}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Resolution Modal */}
    {showResolutionModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Resolve Ticket
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Please provide a resolution message (optional):
          </p>
          <textarea
            value={resolutionText}
            onChange={(e) => setResolutionText(e.target.value)}
            placeholder="Describe how the issue was resolved..."
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
            rows={4}
          />
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => {
                setShowResolutionModal(false);
                setResolutionText("");
              }}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleResolveWithMessage}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Resolve Ticket
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default TicketDetails;

