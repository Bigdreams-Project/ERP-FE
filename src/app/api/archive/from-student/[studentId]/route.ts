import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { isAdmin } from "@/lib/auth/role-check";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * POST handler - Archive student (MOVE from Student table to Archive table)
 * Admin only - Moves student data to Archive and hard-deletes student
 * 
 * RBAC NOTE: 
 * - Backend MUST capture student.centerId when creating archive record
 * - Archive record MUST have centerId set from the original student record
 * - This ensures proper center-scoped filtering for future RBAC implementation
 * - Backend should map: archiveRecord.centerId = student.centerId
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
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

    const { studentId } = await params;

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    // Call backend API to archive student
    const response = await axios.post(
      `${AuthRoutes.BASE_URL}/archive/from-student/${studentId}`,
      {},
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
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          error.response.data?.details ||
                          `Backend error: ${error.response.statusText}`;
      return NextResponse.json(
        { error: errorMessage },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to archive student" },
      { status: 500 }
    );
  }
}

