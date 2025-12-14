import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { isAdmin } from "@/lib/auth/role-check";

/**
 * POST handler - Bulk upload regular courses (new courses)
 * Proxies request to backend to avoid CORS issues
 * Admin only
 * Route: /api/courses/bulk-upload-regular
 */
export async function POST(request: NextRequest) {
  let payload: any = null;
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    payload = await request.json();

    if (!payload) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }
    const response = await axios.post(
      `${AuthRoutes.BASE_URL}/courses/bulk-upload-regular`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    if (error.response) {
      return NextResponse.json(
        {
          error:
            error.response.data?.message || "Failed to bulk upload regular courses",
        },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to bulk upload regular courses" },
      { status: 500 }
    );
  }
}

