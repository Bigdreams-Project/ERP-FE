import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * GET handler - Fetch all banks
 * Proxies request to backend to avoid CORS issues
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
    console.log("API /api/banks: Received X-Center-Id header:", centerId);
    
    const headers: Record<string, string> = {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    };

    // Only add X-Center-Id header if it's provided and not "all"
    if (centerId && centerId !== "all") {
      headers["X-Center-Id"] = centerId;
      console.log("API /api/banks: Forwarding X-Center-Id to backend:", centerId);
    } else {
      console.log("API /api/banks: Not forwarding X-Center-Id (centerId:", centerId, ")");
    }

    const response = await axios.get(`${AuthRoutes.BASE_URL}/banks`, {
      headers,
    });
    
    console.log("API /api/banks: Backend returned", Array.isArray(response.data) ? response.data.length : "non-array", "banks");

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to fetch banks:", error);
    if (error.response) {
      return NextResponse.json(
        { error: error.response.data?.message || "Failed to fetch banks" },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch banks" },
      { status: 500 }
    );
  }
}

