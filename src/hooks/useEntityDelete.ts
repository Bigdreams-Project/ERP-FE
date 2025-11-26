/**
 * Reusable Entity Delete Hook
 * Provides standardized delete functionality for all entity types
 * Handles: loading states, error handling, cache invalidation, toast notifications
 * 
 * NOTE: Soft delete has been removed - use Archive feature instead
 * 
 * Usage:
 *   const { handleHardDelete, isDeleting } = useEntityDelete({ entityType: 'students' });
 */

"use client";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { showError, showSuccess } from "@/lib/toast";
import { EntityType } from "@/services/entity/EntityDeleteService";
import { deleteEntity } from "@/services/client/DeleteClientService";

export interface UseEntityDeleteOptions {
  entityType: EntityType;
  onSuccess?: (id: string) => void;
  onError?: (error: Error, id: string) => void;
  successMessage?: string;
  errorMessage?: string;
}

export interface UseEntityDeleteReturn {
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
    successMessage,
    errorMessage,
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

  const handleHardDelete = async (id: string): Promise<void> => {
    setIsDeleting(true);
    
    try {
      await deleteEntity(entityType, id, "hard");
      
      const message = successMessage || `${entityName} permanently deleted`;
      showSuccess(message);
      
      // Refetch to ensure data is in sync with server
      await queryClient.refetchQueries({ queryKey: [entityType] });
      
      // Call custom success handler if provided
      if (onSuccess) {
        onSuccess(id);
      }
    } catch (error: any) {
      const message = errorMessage || error.message || `Failed to delete ${entityName.toLowerCase()}`;
      showError(message);
      
      // Call custom error handler if provided
      if (onError) {
        onError(error, id);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    handleHardDelete,
    isDeleting,
  };
}

