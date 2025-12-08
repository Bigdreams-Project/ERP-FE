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
    
    const headers: Record<string, string> = {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    };

    // Only add X-Center-Id header if it's provided and not "all"
    // When centerId is null or "all", we don't send the header to get all records
    if (centerId && centerId !== "all") {
      headers["X-Center-Id"] = centerId;
      console.log(`[API /banks] Forwarding request with X-Center-Id: ${centerId}`);
    } else {
      console.log(`[API /banks] Forwarding request WITHOUT X-Center-Id header (requesting all banks)`);
    }

    const backendUrl = `${AuthRoutes.BASE_URL}/banks`;
    console.log(`[API /banks] Calling backend: ${backendUrl}`);
    console.log(`[API /banks] Request headers:`, Object.keys(headers).join(", "));

    const response = await axios.get(backendUrl, {
      headers,
    });
    
    console.log(`[API /banks] Backend returned ${Array.isArray(response.data) ? response.data.length : 0} banks`);
    console.log(`[API /banks] Response status: ${response.status}`);
    
    // Log the actual response data structure for debugging
    if (Array.isArray(response.data)) {
      console.log(`[API /banks] Response is an array with ${response.data.length} items`);
      if (response.data.length > 0) {
        console.log(`[API /banks] First bank sample:`, JSON.stringify(response.data[0], null, 2));
      } else {
        console.log(`[API /banks] Backend returned empty array - no banks found`);
        console.log(`[API /banks] Full response data:`, JSON.stringify(response.data, null, 2));
      }
    } else {
      console.log(`[API /banks] Response is not an array:`, typeof response.data);
      console.log(`[API /banks] Full response data:`, JSON.stringify(response.data, null, 2));
    }

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("[API /banks] Failed to fetch banks:", error);
    if (error.response) {
      console.error(`[API /banks] Backend error status: ${error.response.status}`);
      console.error(`[API /banks] Backend error data:`, JSON.stringify(error.response.data, null, 2));
      console.error(`[API /banks] Request URL: ${AuthRoutes.BASE_URL}/banks`);
      return NextResponse.json(
        { error: error.response.data?.message || "Failed to fetch banks" },
        { status: error.response.status || 500 }
      );
    }
    if (error.request) {
      console.error("[API /banks] No response received from backend:", error.request);
      console.error(`[API /banks] Request URL: ${AuthRoutes.BASE_URL}/banks`);
    } else {
      console.error("[API /banks] Error setting up request:", error.message);
    }
    return NextResponse.json(
      { error: "Failed to fetch banks" },
      { status: 500 }
    );
  }
}

