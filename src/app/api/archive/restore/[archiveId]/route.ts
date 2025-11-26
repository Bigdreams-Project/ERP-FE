import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { isAdmin } from "@/lib/auth/role-check";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * POST handler - Restore student from Archive (MOVE from Archive table to Student table)
 * Admin only - Moves archive record back to Student and hard-deletes archive record
 * 
 * RBAC NOTE:
 * - Backend MUST preserve centerId when restoring: student.centerId = archiveRecord.centerId
 * - This maintains center association for proper RBAC filtering
 * - Archive record's centerId is the source of truth for the restored student
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ archiveId: string }> }
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

    const { archiveId } = await params;

    if (!archiveId) {
      return NextResponse.json(
        { error: "Archive ID is required" },
        { status: 400 }
      );
    }

    // Call backend API to restore student
    const response = await axios.post(
      `${AuthRoutes.BASE_URL}/archive/restore/${archiveId}`,
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
    console.error("Failed to restore student:", error);
    if (error.response) {
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          error.response.data?.details ||
                          `Backend error: ${error.response.statusText}`;
      console.error("Backend error details:", error.response.data);
      return NextResponse.json(
        { error: errorMessage },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to restore student" },
      { status: 500 }
    );
  }
}

