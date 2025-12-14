import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { createAdminProtectedRoute } from "@/services/api/AdminProtectedRoute";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * GET handler - Fetch a single student by ID
 * Proxies request to backend to avoid CORS issues
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Student ID is required" }, { status: 400 });
    }

    const response = await axios.get(`${AuthRoutes.BASE_URL}/students/${id}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    if (error.response) {
      return NextResponse.json(
        {
          error:
            error.response.data?.message ||
            error.response.data?.error ||
            "Failed to fetch student",
        },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch student" },
      { status: 500 }
    );
  }
}

/**
 * PATCH handler for soft delete (sets deletedAt timestamp)
 * Uses AdminProtectedRoute service for standardized auth and error handling
 */
export const PATCH = createAdminProtectedRoute(
  async ({ session, id, body }) => {
    // Soft delete: use dedicated soft-delete endpoint
    const response = await axios.patch(
      `${AuthRoutes.BASE_URL}/students/${id}/soft-delete`,
      { deletedAt: body?.deletedAt || new Date().toISOString() },
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
      `${AuthRoutes.BASE_URL}/students/${id}${hard ? "?hard=true" : ""}`,
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

