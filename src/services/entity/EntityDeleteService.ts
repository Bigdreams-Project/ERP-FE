/**
 * Generic Entity Delete Service
 * Provides unified soft and hard delete operations for all entity types
 */

export type EntityType = "students" | "leads" | "centers" | "courses" | "batches";

export interface SoftDeleteOptions {
  deletedAt?: string; // Optional - backend will default to current time if omitted
}

export interface DeleteResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Client-side service for entity deletion operations
 * Replaces duplicate softDelete*Client and hardDelete*Client functions
 */
export class EntityDeleteService {
  /**
   * Soft delete an entity (archive)
   * @param entityType - Type of entity (students, leads, centers, courses, batches)
   * @param id - Entity ID
   * @param options - Optional deletedAt timestamp
   * @returns Promise with deleted entity data
   */
  static async softDelete<T = any>(
    entityType: EntityType,
    id: string,
    options?: SoftDeleteOptions
  ): Promise<T> {
    try {
      const deletedAt = options?.deletedAt || new Date().toISOString();
      
      const res = await fetch(`/api/${entityType}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ deletedAt }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || errorData.error || `Failed to soft delete ${entityType.slice(0, -1)}: ${res.statusText}`
        );
      }

      const data = await res.json();
      return data;
    } catch (err: any) {
      console.error(`Failed to soft delete ${entityType.slice(0, -1)}:`, err.message);
      throw err;
    }
  }

  /**
   * Hard delete an entity (permanent removal)
   * @param entityType - Type of entity (students, leads, centers, courses, batches)
   * @param id - Entity ID
   * @returns Promise with deletion confirmation
   */
  static async hardDelete<T = any>(
    entityType: EntityType,
    id: string
  ): Promise<T> {
    try {
      const res = await fetch(`/api/${entityType}/${id}?hard=true`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || errorData.error || `Failed to hard delete ${entityType.slice(0, -1)}: ${res.statusText}`
        );
      }

      const data = await res.json();
      return data;
    } catch (err: any) {
      console.error(`Failed to hard delete ${entityType.slice(0, -1)}:`, err.message);
      throw err;
    }
  }
}

