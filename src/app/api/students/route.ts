import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { CreateStudent } from "@/types/requests/student.interface";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * GET handler - Fetch all students
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

    const response = await axios.get(`${AuthRoutes.BASE_URL}/students`, {
      headers,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to fetch students:", error);
    if (error.response) {
      return NextResponse.json(
        { error: error.response.data?.message || "Failed to fetch students" },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 }
    );
  }
}

/**
 * POST handler - Create a new student
 * Proxies request to backend to avoid CORS issues
 * Supports X-Center-Id header for center-specific operations
 */
export async function POST(request: NextRequest) {
  let payload: CreateStudent | null = null;
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    payload = await request.json();

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

    const response = await axios.post(
      `${AuthRoutes.BASE_URL}/students`,
      payload,
      {
        headers,
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to create student:", error);
    if (error.response) {
      if (payload) {
        console.error("Payload sent:", JSON.stringify(payload, null, 2));
      }
      return NextResponse.json(
        { error: error.response.data?.message || "Failed to create student" },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create student" },
      { status: 500 }
    );
  }
}

