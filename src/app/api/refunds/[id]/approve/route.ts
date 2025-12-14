import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { canApproveRefunds } from "@/lib/auth/role-check";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * PATCH handler - Approve a refund (CEO, ADMIN, or Regional Manager only)
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

    // Check if user can approve refunds
    const canApprove = await canApproveRefunds();
    if (!canApprove) {
      return NextResponse.json(
        { error: "Forbidden: Only CEO, ADMIN, or Regional Manager can approve refunds" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const payload = await request.json();

    const response = await axios.patch(
      `${AuthRoutes.BASE_URL}/refunds/${id}/approve`,
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
    if (error.response) {
      return NextResponse.json(
        { error: error.response.data?.message || "Failed to approve refund" },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to approve refund" },
      { status: 500 }
    );
  }
}
