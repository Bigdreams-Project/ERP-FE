import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { isAdmin } from "@/lib/auth/role-check";
import { BulkUploadArchiveRequest, ArchiveRecordsResponse, CreateArchiveRecord } from "@/types/requests/archive.interface";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * GET handler - Fetch all archive records
 * Admin only - Returns all records (no center filtering for admin)
 */
export async function GET(request: NextRequest) {
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

    // Extract query parameters
    const url = new URL(request.url);
    const page = url.searchParams.get("page") || "1";
    const limit = url.searchParams.get("limit") || "10";
    const search = url.searchParams.get("search") || "";

    const response = await axios.get(`${AuthRoutes.BASE_URL}/archive`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
      params: {
        page,
        limit,
        search,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to fetch archive records:", error);
    if (error.response) {
      return NextResponse.json(
        { error: error.response.data?.message || "Failed to fetch archive records" },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch archive records" },
      { status: 500 }
    );
  }
}

/**
 * POST handler - Create single archive record or bulk upload archive records
 * Admin only - Can create/upload for any center
 */
export async function POST(request: NextRequest) {
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

    const payload = await request.json();

    // Check if it's a single record or bulk upload
    // Single record has centerId, bulk upload has records array
    if (payload.records && Array.isArray(payload.records)) {
      // Bulk upload
      const bulkPayload: BulkUploadArchiveRequest = payload;
      const response = await axios.post(
        `${AuthRoutes.BASE_URL}/archive/bulk-upload`,
        bulkPayload,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return NextResponse.json(response.data);
    } else {
      // Single record creation
      const singlePayload: CreateArchiveRecord = payload;
      const response = await axios.post(
        `${AuthRoutes.BASE_URL}/archive`,
        singlePayload,
        {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return NextResponse.json(response.data);
    }
  } catch (error: any) {
    console.error("Failed to create/upload archive records:", error);
    if (error.response) {
      return NextResponse.json(
        { error: error.response.data?.message || "Failed to create/upload archive records" },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create/upload archive records" },
      { status: 500 }
    );
  }
}

