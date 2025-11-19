/**
 * Reusable Entity Delete Hook
 * Provides standardized delete functionality for all entity types
 * Handles: loading states, error handling, cache invalidation, toast notifications
 * 
 * Usage:
 *   const { handleSoftDelete, handleHardDelete, isDeleting } = useEntityDelete('students');
 */

"use client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { showError, showSuccess } from "@/lib/toast";
import { EntityType } from "@/services/entity/EntityDeleteService";
import { deleteEntity } from "@/services/client/DeleteClientService";

export interface UseEntityDeleteOptions {
  entityType: EntityType;
  onSuccess?: (id: string, type: "soft" | "hard") => void;
  onError?: (error: Error, id: string, type: "soft" | "hard") => void;
  successMessages?: {
    soft?: string;
    hard?: string;
  };
  errorMessages?: {
    soft?: string;
    hard?: string;
  };
}

export interface UseEntityDeleteReturn {
  handleSoftDelete: (id: string, options?: { deletedAt?: string }) => Promise<void>;
  handleHardDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

/**
 * Reusable hook for entity deletion operations
 * Replaces duplicate handleSoftDelete/handleHardDelete in all table components
 * 
 * @param options - Configuration for the delete operations
 * @returns Delete handlers and loading state
 */
export function useEntityDelete(
  options: UseEntityDeleteOptions
): UseEntityDeleteReturn {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    entityType,
    onSuccess,
    onError,
    successMessages,
    errorMessages,
  } = options;

  // Get entity name for messages (e.g., "students" -> "Student")
  const entityName = entityType.slice(0, -1).charAt(0).toUpperCase() + entityType.slice(0, -1).slice(1);

  const handleSoftDelete = async (
    id: string,
    deleteOptions?: { deletedAt?: string }
  ): Promise<void> => {
    setIsDeleting(true);
    try {
      await deleteEntity(entityType, id, "soft", deleteOptions);
      
      const message = successMessages?.soft || `${entityName} archived successfully`;
      showSuccess(message);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [entityType] });
      
      // Call custom success handler if provided
      if (onSuccess) {
        onSuccess(id, "soft");
      }
    } catch (error: any) {
      const message = errorMessages?.soft || error.message || `Failed to archive ${entityName.toLowerCase()}`;
      showError(message);
      
      // Call custom error handler if provided
      if (onError) {
        onError(error, id, "soft");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleHardDelete = async (id: string): Promise<void> => {
    setIsDeleting(true);
    try {
      await deleteEntity(entityType, id, "hard");
      
      const message = successMessages?.hard || `${entityName} permanently deleted`;
      showSuccess(message);
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [entityType] });
      
      // Call custom success handler if provided
      if (onSuccess) {
        onSuccess(id, "hard");
      }
    } catch (error: any) {
      const message = errorMessages?.hard || error.message || `Failed to delete ${entityName.toLowerCase()}`;
      showError(message);
      
      // Call custom error handler if provided
      if (onError) {
        onError(error, id, "hard");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    handleSoftDelete,
    handleHardDelete,
    isDeleting,
  };
}

