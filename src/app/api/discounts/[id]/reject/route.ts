import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * PATCH handler - Reject a discount (CEO only)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const payload = await request.json();

    const response = await axios.patch(
      `${AuthRoutes.BASE_URL}/discounts/${id}/reject`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to reject discount:", error);
    if (error.response) {
      return NextResponse.json(
        { error: error.response.data?.message || "Failed to reject discount" },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to reject discount" },
      { status: 500 }
    );
  }
}

