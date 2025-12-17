import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { createAdminProtectedRoute } from "@/services/api/AdminProtectedRoute";
import { NextRequest } from "next/server";
import axios from "axios";

/**
 * PATCH handler for updating batch data or soft delete
 * Uses AdminProtectedRoute service for standardized auth and error handling
 */
export const PATCH = createAdminProtectedRoute(
  async ({ session, id, body }) => {
    // Check if this is a soft delete request (has deletedAt field only)
    if (body?.deletedAt && Object.keys(body).length === 1) {
      // Soft delete: use dedicated soft-delete endpoint
      const response = await axios.patch(
        `${AuthRoutes.BASE_URL}/batches/${id}/soft-delete`,
        { deletedAt: body.deletedAt },
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    }

    // Regular update: update batch data
    const response = await axios.patch(
      `${AuthRoutes.BASE_URL}/batches/${id}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  },
  { requireBody: true }
);

/**
 * DELETE handler for hard delete (permanent removal)
 * Uses AdminProtectedRoute service for standardized auth and error handling
 */
export const DELETE = createAdminProtectedRoute(
  async ({ session, id, searchParams }) => {
    const hard = searchParams?.get("hard") === "true";

    // Hard delete: permanently remove
    const response = await axios.delete(
      `${AuthRoutes.BASE_URL}/batches/${id}${hard ? "?hard=true" : ""}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  }
);

