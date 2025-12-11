/**
 * Unified Client-Side Delete Service
 * Replaces all duplicate softDelete*Client and hardDelete*Client functions
 * 
 * Usage:
 *   import { deleteEntity } from '@/services/client/DeleteClientService';
 *   await deleteEntity('students', id, 'soft');
 *   await deleteEntity('students', id, 'hard');
 */

import { EntityDeleteService, EntityType } from "../entity/EntityDeleteService";

export type DeleteType = "soft" | "hard";

/**
 * Unified delete function for all entity types
 * Replaces: softDeleteStudentClient, hardDeleteStudentClient, 
 *          softDeleteLeadClient, hardDeleteLeadClient, etc.
 * 
 * @param entityType - Type of entity to delete
 * @param id - Entity ID
 * @param type - 'soft' for archive, 'hard' for permanent deletion
 * @param options - Optional deletedAt timestamp for soft delete
 * @returns Promise with deletion result
 */
export async function deleteEntity<T = any>(
  entityType: EntityType,
  id: string,
  type: DeleteType,
  options?: { deletedAt?: string }
): Promise<T> {
  if (type === "soft") {
    return EntityDeleteService.softDelete<T>(entityType, id, options);
  } else {
    return EntityDeleteService.hardDelete<T>(entityType, id);
  }
}

/**
 * Convenience functions for backward compatibility
 * These can be used during migration period
 */
export const softDeleteEntity = <T = any>(
  entityType: EntityType,
  id: string,
  options?: { deletedAt?: string }
) => EntityDeleteService.softDelete<T>(entityType, id, options);

export const hardDeleteEntity = <T = any>(
  entityType: EntityType,
  id: string
) => EntityDeleteService.hardDelete<T>(entityType, id);

