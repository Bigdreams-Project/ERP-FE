import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * GET handler - Fetch all discounts
 * Proxies request to backend to avoid CORS issues
 * Supports X-Center-Id header for center-specific filtering
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      console.error("[API /discounts GET] No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const centerId = request.headers.get("X-Center-Id");
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const studentId = searchParams.get("studentId");
    const courseId = searchParams.get("courseId");

    console.log("[API /discounts GET] Request received:", {
      centerId,
      status,
      studentId,
      courseId,
      url: request.url,
    });

    const headers: Record<string, string> = {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    };

    if (centerId && centerId !== "all") {
      headers["X-Center-Id"] = centerId;
    }

    const params: Record<string, string> = {};
    if (status) params.status = status;
    if (studentId) params.studentId = studentId;
    if (courseId) params.courseId = courseId;

    const backendUrl = `${AuthRoutes.BASE_URL}/discounts`;
    console.log("[API /discounts GET] Calling backend:", {
      url: backendUrl,
      headers: Object.keys(headers),
      params,
    });

    const response = await axios.get(backendUrl, {
      headers,
      params,
    });

    const backendResponse = response.data;
    
    // Backend returns { data: Discount[], total: number, page?: number, limit?: number }
    // Extract the data array from the response
    const discounts = backendResponse?.data || (Array.isArray(backendResponse) ? backendResponse : []);
    const total = backendResponse?.total || discounts.length;
    
    // Debug logging
    console.log(`[API /discounts GET] Backend response:`, {
      status: response.status,
      responseType: typeof backendResponse,
      hasDataField: !!backendResponse?.data,
      isArray: Array.isArray(backendResponse),
      discountsCount: discounts.length,
      total,
      centerId,
      queryStatus: status,
      studentId,
      courseId,
      sampleDiscount: discounts.length > 0 ? {
        id: discounts[0].id,
        status: discounts[0].status,
        hasStatus: !!discounts[0].status,
        studentId: discounts[0].studentId,
        courseId: discounts[0].courseId,
        discountType: discounts[0].discountType,
        discountValue: discounts[0].discountValue,
      } : null,
      rawResponse: backendResponse,
    });

    // Return the discounts array directly (frontend expects array)
    // But also include total for reference
    return NextResponse.json(discounts);
  } catch (error: any) {
    console.error("[API /discounts GET] Error fetching discounts:", {
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      } : null,
      stack: error.stack,
    });
    
    if (error.response) {
      return NextResponse.json(
        { 
          error: error.response.data?.message || "Failed to fetch discounts",
          details: error.response.data,
        },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to fetch discounts" },
      { status: 500 }
    );
  }
}

/**
 * POST handler - Create a new discount request
 * Proxies request to backend to avoid CORS issues
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await request.json();
    const centerId = request.headers.get("X-Center-Id");

    // Log the payload for debugging
    console.log("Discount request payload:", JSON.stringify(payload, null, 2));

    const headers: Record<string, string> = {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    };

    if (centerId && centerId !== "all") {
      headers["X-Center-Id"] = centerId;
    }

    console.log(`[API /discounts] Calling backend: ${AuthRoutes.BASE_URL}/discounts`);
    console.log(`[API /discounts] Request headers:`, Object.keys(headers).join(", "));
    
    const response = await axios.post(
      `${AuthRoutes.BASE_URL}/discounts`,
      payload,
      { headers }
    );

    console.log(`[API /discounts] Backend response status: ${response.status}`);
    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create discount request - Full error:", error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    console.error("Error message:", error.message);
    
    if (error.response) {
      const errorData = error.response.data;
      const errorMessage = errorData?.message || errorData?.error || errorData?.details || "Failed to create discount request";
      const errorDetails = errorData?.details || errorData?.errors || errorData?.validationErrors;
      
      console.error("Backend error response:", {
        status: error.response.status,
        data: errorData,
        message: errorMessage,
        details: errorDetails,
      });

      // Return more detailed error information
      return NextResponse.json(
        { 
          error: errorMessage,
          details: errorDetails,
          status: error.response.status,
          backendError: errorData,
        },
        { status: error.response.status || 500 }
      );
    }
    
    // Handle cases where axios throws an error without a response
    const errorMessage = error.message || "Failed to create discount request";
    console.error("Error without response:", errorMessage);
    
    return NextResponse.json(
      { 
        error: errorMessage,
        message: "An error occurred while creating the discount request. Please check the server logs for details.",
      },
      { status: 500 }
    );
  }
}

