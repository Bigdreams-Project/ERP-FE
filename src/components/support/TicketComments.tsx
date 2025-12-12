"use client";
import { useState, useMemo } from "react";
import { useQuery, useQueryClient, useMutation, useQueries } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getTicketCommentsClient,
  addTicketCommentClient,
  getUserClient,
} from "@/lib/client-network";
import {
  TicketComment,
  CreateTicketCommentRequest,
} from "@/types/support/ticket.interface";
import { User } from "@/types/auth/user.interface";
import { formatDate } from "@/lib/utils";
import { MessageSquare, Send, User as UserIcon, Loader2 } from "lucide-react";

interface TicketCommentsProps {
  ticketId: string;
}

const TicketComments = ({ ticketId }: TicketCommentsProps) => {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");

  // Fetch comments
  const {
    data: comments = [],
    isLoading: isLoadingComments,
    error: commentsError,
    refetch: refetchComments,
  } = useQuery<TicketComment[]>({
    queryKey: ["ticket-comments", ticketId],
    queryFn: () => getTicketCommentsClient(ticketId),
    staleTime: 1000 * 60 * 1, // 1 minute
    refetchOnWindowFocus: true,
  });

  // Get unique user IDs from comments that don't have createdByName
  const userIdsToFetch = useMemo(() => {
    if (!comments.length) return [];
    const uniqueIds = new Set<string>();
    comments.forEach((comment) => {
      if (comment.createdBy && !comment.createdByName) {
        uniqueIds.add(comment.createdBy);
      }
    });
    return Array.from(uniqueIds);
  }, [comments]);

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

  // Helper function to get comment creator name
  const getCommentCreatorName = (comment: TicketComment) => {
    // If createdByName is provided, use it
    if (comment.createdByName) {
      return comment.createdByName;
    }
    // If we have the user in our map, use it
    if (userMap.has(comment.createdBy)) {
      return userMap.get(comment.createdBy)!;
    }
    // Check if we're still loading this user
    const userIndex = userIdsToFetch.indexOf(comment.createdBy);
    if (userIndex !== -1) {
      const userQuery = userQueries[userIndex];
      if (userQuery.isLoading) {
        return "Loading...";
      }
      if (userQuery.error) {
        return `User ID: ${comment.createdBy}`;
      }
    }
    // Fallback
    return "Unknown User";
  };

  // Add comment mutation with optimistic update
  const addCommentMutation = useMutation({
    mutationFn: (payload: CreateTicketCommentRequest) =>
      addTicketCommentClient(payload),
    onMutate: async (newComment) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["ticket-comments", ticketId] });

      // Snapshot the previous value
      const previousComments = queryClient.getQueryData<TicketComment[]>([
        "ticket-comments",
        ticketId,
      ]);

      // Optimistically update to the new value
      const optimisticComment: TicketComment = {
        id: `temp-${Date.now()}`,
        ticketId,
        comment: newComment.comment,
        createdBy: "current-user", // Will be replaced by actual user from backend
        createdByName: "You", // Temporary name
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        attachments: newComment.attachments,
      };

      queryClient.setQueryData<TicketComment[]>(
        ["ticket-comments", ticketId],
        (old = []) => [...old, optimisticComment]
      );

      // Return a context object with the snapshotted value
      return { previousComments };
    },
    onError: (err, newComment, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["ticket-comments", ticketId],
          context.previousComments
        );
      }
      toast.error("Failed to add comment. Please try again.");
    },
    onSuccess: (data) => {
      // Refetch to get the actual comment with correct ID and user info
      refetchComments();
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure consistency
      queryClient.invalidateQueries({ queryKey: ["ticket-comments", ticketId] });
    },
  });

  const handleAddComment = () => {
    if (!commentText.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    addCommentMutation.mutate({
      ticketId,
      comment: commentText.trim(),
    });

    // Clear the input after mutation starts
    setCommentText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleAddComment();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Comments ({comments.length})
      </h2>

      {/* Add Comment Form */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
        <label
          htmlFor="comment-input"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Add a comment
        </label>
        <textarea
          id="comment-input"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your comment here... (Press Ctrl/Cmd + Enter to submit)"
          rows={4}
          disabled={addCommentMutation.isPending}
          className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed resize-none"
        />
        <div className="flex items-center justify-between mt-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {commentText.length} characters
          </p>
          <button
            onClick={handleAddComment}
            disabled={addCommentMutation.isPending || !commentText.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {addCommentMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Add Comment
              </>
            )}
          </button>
        </div>
      </div>

      {/* Comments List */}
      {isLoadingComments ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 dark:text-blue-400" />
          <span className="ml-2 text-gray-500 dark:text-gray-400">
            Loading comments...
          </span>
        </div>
      ) : commentsError ? (
        <div className="text-center py-8">
          <div className="text-red-600 dark:text-red-400 mb-2">
            Failed to load comments
          </div>
          <button
            onClick={() => refetchComments()}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <MessageSquare className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No comments yet
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Be the first to comment on this ticket
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-3 bg-gray-50 dark:bg-gray-700/30 rounded-r-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {getCommentCreatorName(comment)}
                    </span>
                    {comment.id.startsWith("temp-") && (
                      <span className="ml-2 text-xs text-yellow-600 dark:text-yellow-400">
                        (Sending...)
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                {comment.comment}
              </p>
              {comment.attachments && comment.attachments.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Attachments:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {comment.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        File {index + 1}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketComments;

