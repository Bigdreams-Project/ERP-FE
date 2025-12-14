import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * GET handler - Fetch all refunds
 * Proxies request to backend to avoid CORS issues
 * Supports X-Center-Id header for center-specific filtering
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const centerId = request.headers.get("X-Center-Id");
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const studentId = searchParams.get("studentId");
    const paymentId = searchParams.get("paymentId");
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");

    const headers: Record<string, string> = {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    };

    if (centerId && centerId !== "all") {
      headers["X-Center-Id"] = centerId;
    }

    const params: Record<string, string> = {};
    if (status && status !== "all") params.status = status;
    if (search) params.search = search;
    if (studentId) params.studentId = studentId;
    if (paymentId) params.paymentId = paymentId;
    if (page) params.page = page;
    if (limit) params.limit = limit;

    const response = await axios.get(`${AuthRoutes.BASE_URL}/refunds`, {
      headers,
      params,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    if (error.response) {
      return NextResponse.json(
        { error: error.response.data?.message || "Failed to fetch refunds" },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch refunds" },
      { status: 500 }
    );
  }
}

/**
 * POST handler - Create a new refund request
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

    const headers: Record<string, string> = {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    };

    if (centerId && centerId !== "all") {
      headers["X-Center-Id"] = centerId;
    }

    const response = await axios.post(
      `${AuthRoutes.BASE_URL}/refunds`,
      payload,
      { headers }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    if (error.response) {
      const errorData = error.response.data;
      const errorMessage = errorData?.message || errorData?.error || "Failed to create refund request";
      const errorDetails = errorData?.details || errorData?.errors || errorData?.validationErrors;
      return NextResponse.json(
        { 
          error: errorMessage,
          details: errorDetails,
          status: error.response.status,
        },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create refund request" },
      { status: 500 }
    );
  }
}

