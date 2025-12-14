import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * PATCH handler - Approve a discount (CEO only)
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
    const backendUrl = `${AuthRoutes.BASE_URL}/discounts/${id}/approve`;
    const response = await axios.patch(
      backendUrl,
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
      const errorData = error.response.data;
      const errorMessage = errorData?.message || 
                          errorData?.error || 
                          `Failed to approve discount: ${error.response.statusText}`;
      
      return NextResponse.json(
        { 
          error: errorMessage,
          details: errorData,
          status: error.response.status,
        },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to approve discount" },
      { status: 500 }
    );
  }
}

