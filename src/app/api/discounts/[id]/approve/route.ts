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
      console.error("[API /discounts/[id]/approve] No session found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const payload = await request.json();

    console.log("[API /discounts/[id]/approve] Request:", {
      id,
      payload,
      userId: session.user?.id,
    });

    const backendUrl = `${AuthRoutes.BASE_URL}/discounts/${id}/approve`;
    console.log("[API /discounts/[id]/approve] Calling backend:", backendUrl);

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

    console.log("[API /discounts/[id]/approve] Backend response:", {
      status: response.status,
      data: response.data,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("[API /discounts/[id]/approve] Error:", {
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      } : null,
      stack: error.stack,
    });
    
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

