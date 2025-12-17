"use client";
import { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient, useQueries } from "@tanstack/react-query";
import { getTicketsClient, createTicketClient, getUserClient } from "@/lib/client-network";
import { useCenter } from "@/context/CenterContext";
import { Ticket, TicketStatus, TicketPriority, TicketCategory, CreateTicketRequest } from "@/types/support/ticket.interface";
import { User } from "@/types/auth/user.interface";
import NotFoundComponent from "@/components/NotFoundComponent";
import CreateTicketModal from "@/components/modals/support/CreateTicketModal";
import { formatDate } from "@/lib/utils";
import { Eye, MessageSquare, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";

const TicketsContent = () => {
  const { selectedCenter, isLoading: isCenterLoading, centerContext } = useCenter();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const centerIdForQuery = useMemo(() => {
    if (!isCenterLoading && centerContext && !centerContext.canSwitch && centerContext.currentCenterId) {
      return centerContext.currentCenterId;
    }
    return selectedCenter === "all" ? null : selectedCenter;
  }, [isCenterLoading, centerContext, selectedCenter]);

  const { data: tickets = [], isLoading, error } = useQuery({
    queryKey: ["tickets", centerIdForQuery, statusFilter, priorityFilter],
    queryFn: () => {
      return getTicketsClient(centerIdForQuery, {
        status: statusFilter,
        priority: priorityFilter,
      });
    },
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    enabled: !isCenterLoading,
  });

  // Get unique user IDs from tickets that don't have createdByName
  const userIdsToFetch = useMemo(() => {
    if (!tickets.length) return [];
    const uniqueIds = new Set<string>();
    tickets.forEach((ticket: Ticket) => {
      if (ticket.createdBy && !ticket.createdByName) {
        uniqueIds.add(ticket.createdBy);
      }
    });
    return Array.from(uniqueIds);
  }, [tickets]);

  // Fetch user data for all unique user IDs using useQueries
  const userQueries = useQueries({
    queries: userIdsToFetch.map((userId) => ({
      queryKey: ["user", userId],
      queryFn: () => getUserClient(userId),
      enabled: !!userId,
      staleTime: 1000 * 60 * 10, // Cache for 10 minutes
      retry: 1,
    })),
  });

  // Create a map of user ID to user name
  const userMap = useMemo(() => {
    const map = new Map<string, string>();
    userQueries.forEach((query, index) => {
      const userId = userIdsToFetch[index];
      if (query.data) {
        const fullName = `${query.data.firstname} ${query.data.lastname}`.trim();
        if (fullName) {
          map.set(userId, fullName);
        }
      }
    });
    return map;
  }, [userQueries, userIdsToFetch]);

  // Helper function to get creator name
  const getCreatorName = (ticket: Ticket) => {
    // If createdByName is provided, use it
    if (ticket.createdByName) {
      return ticket.createdByName;
    }
    // If we have the user in our map, use it
    if (userMap.has(ticket.createdBy)) {
      return userMap.get(ticket.createdBy)!;
    }
    // Check if we're still loading this user
    const userIndex = userIdsToFetch.indexOf(ticket.createdBy);
    if (userIndex !== -1) {
      const userQuery = userQueries[userIndex];
      if (userQuery.isLoading) {
        return "Loading...";
      }
      if (userQuery.error) {
        return `User ID: ${ticket.createdBy}`;
      }
    }
    // Fallback
    return "N/A";
  };

  // Log tickets for debugging
  useEffect(() => {
    if (!isLoading && tickets) {
    }
    if (error) {
    }
  }, [tickets, isLoading, error]);

  const filteredTickets = useMemo(() => {
    if (!searchQuery.trim()) {
      return tickets;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = tickets.filter((ticket: Ticket) =>
      ticket.title.toLowerCase().includes(query) ||
      ticket.description.toLowerCase().includes(query) ||
      ticket.createdByName?.toLowerCase().includes(query)
    );
    return filtered;
  }, [tickets, searchQuery]);

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return "bg-blue-100 text-blue-800";
      case TicketStatus.IN_PROGRESS:
        return "bg-yellow-100 text-yellow-800";
      case TicketStatus.RESOLVED:
        return "bg-green-100 text-green-800";
      case TicketStatus.CLOSED:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
      case TicketStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getPriorityColor = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.LOW:
        return "text-green-600";
      case TicketPriority.MEDIUM:
        return "text-yellow-600";
      case TicketPriority.HIGH:
        return "text-orange-600";
      case TicketPriority.URGENT:
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getPriorityIcon = (priority: TicketPriority) => {
    switch (priority) {
      case TicketPriority.URGENT:
        return <AlertCircle className="w-4 h-4" />;
      case TicketPriority.HIGH:
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
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

  const handleCreateTicket = async (ticket: CreateTicketRequest) => {
    try {
      await createTicketClient(ticket, centerIdForQuery);
      toast.success("Support ticket created successfully");
      setIsModalOpen(false);
      // Invalidate and refetch tickets
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    } catch (error: any) {
      toast.error(error.message || "Failed to create support ticket. Please try again.");
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Support Tickets
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage and track all support tickets and customer inquiries
            </p>
          </div>
          <button
            className="flex items-center justify-between gap-2 px-3 py-2 text-white bg-add-button rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus className="text-white" size={16} />
            <span className="text-white text-sm">Add Ticket</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, description, or creator..."
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
                <option value={TicketStatus.OPEN}>Open</option>
                <option value={TicketStatus.IN_PROGRESS}>In Progress</option>
                <option value={TicketStatus.RESOLVED}>Resolved</option>
                <option value={TicketStatus.CLOSED}>Closed</option>
                <option value={TicketStatus.CANCELLED}>Cancelled</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">All Priorities</option>
                <option value={TicketPriority.LOW}>Low</option>
                <option value={TicketPriority.MEDIUM}>Medium</option>
                <option value={TicketPriority.HIGH}>High</option>
                <option value={TicketPriority.URGENT}>Urgent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading tickets...</div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="text-red-600 dark:text-red-400 mb-2">
                Failed to load tickets
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {error instanceof Error ? error.message : "An error occurred"}
              </div>
              <button
                onClick={() => queryClient.invalidateQueries({ queryKey: ["tickets"] })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : filteredTickets.length === 0 ? (
            <NotFoundComponent text="Support Tickets" setIsModalOpen={setIsModalOpen} />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Created By
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTickets.map((ticket: Ticket) => (
                    <tr
                      key={ticket.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => router.push(`/dashboard/settings/tickets/${ticket.id}`)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {ticket.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {ticket.description.substring(0, 60)}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getCategoryLabel(ticket.category)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center gap-1 text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                          {getPriorityIcon(ticket.priority)}
                          <span>{ticket.priority.charAt(0) + ticket.priority.slice(1).toLowerCase()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                            ticket.status
                          )}`}
                        >
                          {ticket.status.replace("_", " ").charAt(0) + ticket.status.replace("_", " ").slice(1).toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getCreatorName(ticket)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ticket.assignedToName || "Unassigned"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(ticket.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/settings/tickets/${ticket.id}`);
                          }}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTicket}
      />
    </div>
  );
};

export default TicketsContent;

