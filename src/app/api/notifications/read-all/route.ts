import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * PATCH handler - Mark all notifications as read
 * Proxies request to backend to avoid CORS issues
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    };

    const response = await axios.patch(
      `${AuthRoutes.BASE_URL}/notifications/read-all`,
      {},
      { headers }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to mark all notifications as read:", error);
    if (error.response) {
      return NextResponse.json(
        { error: error.response.data?.message || "Failed to mark all notifications as read" },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to mark all notifications as read" },
      { status: 500 }
    );
  }
}







