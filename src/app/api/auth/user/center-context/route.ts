import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * GET handler - Fetch user center context
 * Checks if user can switch centers and returns current center info
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      console.error("No session found in center-context route");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!session.accessToken) {
      console.error("No access token in session");
      return NextResponse.json({ error: "Unauthorized - No access token" }, { status: 401 });
    }

    const apiUrl = `${AuthRoutes.BASE_URL}/auth/user/center-context`;
    console.log("Fetching center context from:", apiUrl);

    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to fetch center context:", error);
    if (error.response) {
      console.error("Backend response status:", error.response.status);
      console.error("Backend response data:", error.response.data);
      return NextResponse.json(
        { error: error.response.data?.message || "Failed to fetch center context" },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch center context" },
      { status: 500 }
    );
  }
}




