import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * GET handler - Fetch student summary counts
 * Returns counts for DROPOUT, GRADUATED, and ARCHIVED students
 * Supports X-Center-Id header for center-specific filtering
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get X-Center-Id header from request if provided
    const centerId = request.headers.get("X-Center-Id");
    
    const headers: Record<string, string> = {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    };

    // Only add X-Center-Id header if it's provided and not "all"
    if (centerId && centerId !== "all") {
      headers["X-Center-Id"] = centerId;
      console.log(`[API /students/summary] Forwarding request with X-Center-Id: ${centerId}`);
    } else {
      console.log(`[API /students/summary] Forwarding request WITHOUT X-Center-Id header (requesting all students)`);
    }

    const response = await axios.get(`${AuthRoutes.BASE_URL}/students/summary`, {
      headers,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to fetch student summary:", error);
    if (error.response) {
      return NextResponse.json(
        { error: error.response.data?.message || "Failed to fetch student summary" },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch student summary" },
      { status: 500 }
    );
  }
}

