import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { CreateCourse } from "@/types/requests/course.interface";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * GET handler - Fetch all courses
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
    if (centerId && centerId !== "all") {
      headers["X-Center-Id"] = centerId;
    }

    const response = await axios.get(`${AuthRoutes.BASE_URL}/courses/active`, {
      headers,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    if (error.response) {
      return NextResponse.json(
        { error: error.response.data?.message || "Failed to fetch courses" },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

/**
 * POST handler - Create a new course
 * Proxies request to backend to avoid CORS issues
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { payload, isDraft } = body;

    const response = await axios.post(
      `${AuthRoutes.BASE_URL}/courses`,
      {
        name: payload.name,
        type: payload.type,
        duration: payload.duration,
        isDraft,
      },
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
      return NextResponse.json(
        { error: error.response.data?.message || "Failed to create course" },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}

