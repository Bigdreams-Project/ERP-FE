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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const centerId = request.headers.get("X-Center-Id");
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const studentId = searchParams.get("studentId");
    const courseId = searchParams.get("courseId");

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

    const response = await axios.get(`${AuthRoutes.BASE_URL}/discounts`, {
      headers,
      params,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to fetch discounts:", error);
    if (error.response) {
      return NextResponse.json(
        { error: error.response.data?.message || "Failed to fetch discounts" },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch discounts" },
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

    const headers: Record<string, string> = {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    };

    if (centerId && centerId !== "all") {
      headers["X-Center-Id"] = centerId;
    }

    const response = await axios.post(
      `${AuthRoutes.BASE_URL}/discounts`,
      payload,
      { headers }
    );

    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    console.error("Failed to create discount request:", error);
    if (error.response) {
      return NextResponse.json(
        { error: error.response.data?.message || "Failed to create discount request" },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create discount request" },
      { status: 500 }
    );
  }
}

