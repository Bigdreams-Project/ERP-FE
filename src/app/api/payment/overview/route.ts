import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * GET handler - Fetch finance overview
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

    const headers: Record<string, string> = {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    };

    // Only add X-Center-Id header if it's provided and not "all"
    // When centerId is null or "all", we don't send the header to get all records
    if (centerId && centerId !== "all") {
      headers["X-Center-Id"] = centerId;
    }

    // Try /payments/overview first (plural), fallback to /payment/overview (singular)
    let response;
    let endpointUsed = "";

    try {
      endpointUsed = `${AuthRoutes.BASE_URL}/payments/overview`;
      response = await axios.get(endpointUsed, { headers });
    } catch (firstError: any) {
      if (firstError.response?.status === 404) {
        // Try singular version
        try {
          endpointUsed = `${AuthRoutes.BASE_URL}/payment/overview`;
          response = await axios.get(endpointUsed, { headers });
        } catch (secondError: any) {
          // Both failed, throw the second error
          throw secondError;
        }
      } else {
        // Non-404 error, throw it
        throw firstError;
      }
    }

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Handle 404 gracefully - return default data structure instead of error
    if (error.response?.status === 404) {
      return NextResponse.json({
        totalRevenue: 0,
        totalBilling: 0,
        totalPending: 0,
        totalPayments: 0,
        collectionRate: 0,
        topCenters: [],
        topPendingCenters: [],
        topPerformingCenter: null,
        centerPerformanceMatrix: [],
      });
    }

    // Log other errors with full details
    if (error.response) {
      console.error("[API /payment/overview] Error:", {
        message:
          error.response.data?.message || "Failed to fetch finance overview",
        data: error.response.data,
        url: `${AuthRoutes.BASE_URL}/payment/overview`,
      });
      // Return default data instead of error response
      return NextResponse.json({
        totalRevenue: 0,
        totalBilling: 0,
        totalPending: 0,
        totalPayments: 0,
        collectionRate: 0,
        topCenters: [],
        topPendingCenters: [],
        topPerformingCenter: null,
        centerPerformanceMatrix: [],
      });
    }
    // Return default data for network errors too
    return NextResponse.json({
      totalRevenue: 0,
      totalPending: 0,
      totalPayments: 0,
      topCenters: [],
      topPendingCenters: [],
      topPerformingCenter: null,
    });
  }
}
