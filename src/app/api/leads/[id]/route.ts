import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { createAdminProtectedRoute } from "@/services/api/AdminProtectedRoute";
import { NextRequest } from "next/server";
import axios from "axios";

/**
 * PATCH handler for updating leads or soft delete
 * Uses AdminProtectedRoute service for standardized auth and error handling
 */
export const PATCH = createAdminProtectedRoute(
  async ({ session, id, body }) => {
    // If body contains only deletedAt, it's a soft delete request
    if (body?.deletedAt && Object.keys(body).length === 1) {
      const response = await axios.patch(
        `${AuthRoutes.BASE_URL}/leads/${id}/soft-delete`,
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

    // Otherwise, it's a regular update request
    const response = await axios.patch(
      `${AuthRoutes.BASE_URL}/leads/${id}`,
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
      `${AuthRoutes.BASE_URL}/leads/${id}${hard ? "?hard=true" : ""}`,
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

