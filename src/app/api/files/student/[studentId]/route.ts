import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * GET handler - Fetch all files for a student
 * Proxies request to backend
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { studentId } = await params;
    const fileType = request.nextUrl.searchParams.get("fileType");

    const headers: Record<string, string> = {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    };

    let url = `${AuthRoutes.BASE_URL}/files/student/${studentId}`;
    if (fileType) {
      url += `?fileType=${fileType}`;
    }

    const response = await axios.get(url, { headers });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to fetch files:", error);
    if (error.response) {
      return NextResponse.json(
        {
          error:
            error.response.data?.message ||
            error.response.data?.error ||
            "Failed to fetch files",
        },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}

