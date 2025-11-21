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

  // Get entity name for messages (e.g., "students" -> "Student", "batches" -> "Batch")
  // Handle plural forms ending in "es" (batches, courses) vs "s" (students, leads, centers)
  const getEntityName = (type: string): string => {
    if (type.endsWith("es")) {
      // Remove "es" for words like "batches" -> "batch", "courses" -> "course"
      const singular = type.slice(0, -2);
      return singular.charAt(0).toUpperCase() + singular.slice(1);
    } else if (type.endsWith("s")) {
      // Remove "s" for words like "students" -> "student", "leads" -> "lead", "centers" -> "center"
      const singular = type.slice(0, -1);
      return singular.charAt(0).toUpperCase() + singular.slice(1);
    }
    // If no plural ending, capitalize first letter
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  const entityName = getEntityName(entityType);

  const handleSoftDelete = async (
    id: string,
    deleteOptions?: { deletedAt?: string }
  ): Promise<void> => {
    setIsDeleting(true);
    
    // Optimistically update the cache - mark item as deleted
    queryClient.setQueryData([entityType], (old: any[] = []) => {
      return old.map((item: any) =>
        item.id === id ? { ...item, deletedAt: deleteOptions?.deletedAt || new Date().toISOString() } : item
      );
    });
    
    try {
      await deleteEntity(entityType, id, "soft", deleteOptions);
      
      const message = successMessages?.soft || `${entityName} archived successfully`;
      showSuccess(message);
      
      // Refetch to ensure data is in sync with server
      await queryClient.refetchQueries({ queryKey: [entityType] });
      
      // Call custom success handler if provided
      if (onSuccess) {
        onSuccess(id, "soft");
      }
    } catch (error: any) {
      // Rollback optimistic update on error
      await queryClient.refetchQueries({ queryKey: [entityType] });
      
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
    
    // Store current data for rollback
    const previousData = queryClient.getQueryData([entityType]);
    
    // Optimistically remove the item from cache
    queryClient.setQueryData([entityType], (old: any[] = []) => {
      return old.filter((item: any) => item.id !== id);
    });
    
    try {
      await deleteEntity(entityType, id, "hard");
      
      const message = successMessages?.hard || `${entityName} permanently deleted`;
      showSuccess(message);
      
      // Refetch to ensure data is in sync with server
      await queryClient.refetchQueries({ queryKey: [entityType] });
      
      // Call custom success handler if provided
      if (onSuccess) {
        onSuccess(id, "hard");
      }
    } catch (error: any) {
      // Rollback optimistic update on error
      queryClient.setQueryData([entityType], previousData);
      
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

