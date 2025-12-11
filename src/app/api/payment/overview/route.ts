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
      console.log(
        `[API /payment/overview] Forwarding request with X-Center-Id: ${centerId}`
      );
    } else {
      console.log(
        `[API /payment/overview] Forwarding request WITHOUT X-Center-Id header (requesting all finance data)`
      );
    }

    // Try /payments/overview first (plural), fallback to /payment/overview (singular)
    let response;
    let endpointUsed = "";

    try {
      endpointUsed = `${AuthRoutes.BASE_URL}/payments/overview`;
      console.log(`[API /payment/overview] Trying endpoint: ${endpointUsed}`);
      response = await axios.get(endpointUsed, { headers });
      console.log(
        `[API /payment/overview] Success with /payments/overview endpoint`
      );
    } catch (firstError: any) {
      if (firstError.response?.status === 404) {
        // Try singular version
        try {
          endpointUsed = `${AuthRoutes.BASE_URL}/payment/overview`;
          console.log(
            `[API /payment/overview] /payments/overview returned 404, trying: ${endpointUsed}`
          );
          response = await axios.get(endpointUsed, { headers });
          console.log(
            `[API /payment/overview] Success with /payment/overview endpoint`
          );
        } catch (secondError: any) {
          // Both failed, throw the second error
          throw secondError;
        }
      } else {
        // Non-404 error, throw it
        throw firstError;
      }
    }

    console.log(
      `[API /payment/overview] Backend returned finance overview data:`,
      {
        status: response.status,
        hasData: !!response.data,
        totalRevenue: response.data?.totalRevenue,
        totalBilling: response.data?.totalBilling,
        totalPending: response.data?.totalPending,
        collectionRate: response.data?.collectionRate,
        topCentersCount: Array.isArray(response.data?.topCenters)
          ? response.data.topCenters.length
          : 0,
        topPendingCentersCount: Array.isArray(response.data?.topPendingCenters)
          ? response.data.topPendingCenters.length
          : 0,
        centerPerformanceMatrixCount: Array.isArray(
          response.data?.centerPerformanceMatrix
        )
          ? response.data.centerPerformanceMatrix.length
          : 0,
      }
    );
    console.log(
      `[API /payment/overview] Full response data:`,
      JSON.stringify(response.data, null, 2)
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    // Handle 404 gracefully - return default data structure instead of error
    if (error.response?.status === 404) {
      console.warn(
        `[API /payment/overview] Backend endpoint not found (404), returning default data`
      );
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
      console.error(
        `[API /payment/overview] Backend error (${error.response.status}):`,
        {
          message:
            error.response.data?.message || "Failed to fetch finance overview",
          data: error.response.data,
          url: `${AuthRoutes.BASE_URL}/payment/overview`,
        }
      );
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

    console.error("[API /payment/overview] Network or other error:", {
      message: error.message,
      code: error.code,
      url: `${AuthRoutes.BASE_URL}/payment/overview`,
    });
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
