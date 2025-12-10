import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { BulkUploadStudentsRequest } from "@/types/requests/student.interface";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { isAdmin } from "@/lib/auth/role-check";

/**
 * GET handler - Health check for bulk upload route
 */
export async function GET() {
  return NextResponse.json({ message: "Bulk upload route is working" });
}

/**
 * POST handler - Bulk upload students
 * Proxies request to backend to avoid CORS issues
 * Admin only
 * Route: /api/students/bulk-upload
 */
export async function POST(request: NextRequest) {
  let payload: BulkUploadStudentsRequest | null = null;
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

    console.log(`Bulk upload: ${payload.records.length} student records`);

    // Log first record for debugging
    if (payload.records.length > 0) {
      console.log("First record sample:", JSON.stringify(payload.records[0], null, 2));
    }

    const response = await axios.post(
      `${AuthRoutes.BASE_URL}/students/bulk-upload`,
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
    console.error("Failed to bulk upload students:", error);
    if (error.response) {
      if (payload) {
        console.error("Payload sent:", JSON.stringify(payload, null, 2));
      }
      return NextResponse.json(
        {
          error:
            error.response.data?.message || "Failed to bulk upload students",
        },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to bulk upload students" },
      { status: 500 }
    );
  }
}

