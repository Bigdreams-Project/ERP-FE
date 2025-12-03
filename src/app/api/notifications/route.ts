import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * GET handler - Fetch all notifications
 * Proxies request to backend to avoid CORS issues
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const read = searchParams.get("read");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    const headers: Record<string, string> = {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    };

    const params: Record<string, string> = {};
    if (read !== null) {
      params.read = read;
    }
    if (limit) {
      params.limit = limit;
    }
    if (offset) {
      params.offset = offset;
    }

    const response = await axios.get(`${AuthRoutes.BASE_URL}/notifications`, {
      headers,
      params,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to fetch notifications:", error);
    if (error.response) {
      return NextResponse.json(
        { error: error.response.data?.message || "Failed to fetch notifications" },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}




