import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * GET handler - Fetch all tickets
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
    const category = searchParams.get("category");
    const priority = searchParams.get("priority");

    const headers: Record<string, string> = {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    };

    if (centerId && centerId !== "all") {
      headers["X-Center-Id"] = centerId;
    }

    const params: Record<string, string> = {};
    if (status) params.status = status;
    if (category) params.category = category;
    if (priority) params.priority = priority;

    const response = await axios.get(`${AuthRoutes.BASE_URL}/tickets`, {
      headers,
      params,
    });

    console.log("Tickets API - Backend response:", {
      status: response.status,
      dataLength: Array.isArray(response.data) ? response.data.length : "not an array",
      dataType: typeof response.data,
      hasData: !!response.data,
      dataKeys: response.data && typeof response.data === 'object' ? Object.keys(response.data) : 'N/A',
      sampleData: Array.isArray(response.data) && response.data.length > 0 
        ? response.data[0] 
        : response.data,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to fetch tickets:", error);
    if (error.response) {
      return NextResponse.json(
        { error: error.response.data?.message || "Failed to fetch tickets" },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

/**
 * POST handler - Create a new ticket
 */
export async function POST(request: NextRequest) {
  let payload: any = null;
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    payload = await request.json();
    const centerId = request.headers.get("X-Center-Id");

    const headers: Record<string, string> = {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    };

    if (centerId && centerId !== "all") {
      headers["X-Center-Id"] = centerId;
    }

    const response = await axios.post(
      `${AuthRoutes.BASE_URL}/tickets`,
      payload,
      { headers }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to create ticket:", error);
    if (error.response) {
      console.error("Backend error response:", error.response.data);
      if (payload) {
        console.error("Payload sent:", JSON.stringify(payload, null, 2));
      }
      return NextResponse.json(
        { error: error.response.data?.message || error.response.data?.error || "Failed to create ticket" },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create ticket" },
      { status: 500 }
    );
  }
}

