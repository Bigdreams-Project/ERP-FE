import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { CreateLead } from "@/types/requests/lead.interface";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * GET handler - Fetch all leads
 * Proxies request to backend to avoid CORS issues
 * Supports X-Center-Id header for center-specific filtering
 */
export async function GET(request: NextRequest) {
  let headers: Record<string, string> = {};
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get X-Center-Id header from request if provided
    const centerId = request.headers.get("X-Center-Id");
    
    headers = {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    };

    // Only add X-Center-Id header if it's provided and not "all"
    if (centerId && centerId !== "all") {
      headers["X-Center-Id"] = centerId;
      console.log(`[API /leads] Forwarding request with X-Center-Id: ${centerId}`);
    } else {
      console.log(`[API /leads] Forwarding request WITHOUT X-Center-Id header (requesting all leads)`);
    }

    const response = await axios.get(`${AuthRoutes.BASE_URL}/leads/active`, {
      headers,
    });

    console.log(`[API /leads] Backend returned ${Array.isArray(response.data) ? response.data.length : 0} leads`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("[API /leads] Failed to fetch leads:", error);
    if (error.response) {
      console.error(`[API /leads] Backend error status: ${error.response.status}`);
      console.error(`[API /leads] Backend error data:`, JSON.stringify(error.response.data, null, 2));
      console.error(`[API /leads] Request headers sent:`, Object.keys(headers).join(", "));
      return NextResponse.json(
        { error: error.response.data?.message || "Failed to fetch leads" },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

/**
 * POST handler - Create a new lead
 * Proxies request to backend to avoid CORS issues
 * Supports X-Center-Id header for center-specific operations
 */
export async function POST(request: NextRequest) {
  let payload: CreateLead | null = null;
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
      `${AuthRoutes.BASE_URL}/leads`,
      payload,
      {
        headers,
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to create lead:", error);
    if (error.response) {
      if (payload) {
        console.error("Payload sent:", JSON.stringify(payload, null, 2));
      }
      // Log the full error response for debugging
      console.error("Backend error response:", JSON.stringify(error.response.data, null, 2));
      console.error("Backend error status:", error.response.status);
      console.error("Backend error headers:", error.response.headers);
      return NextResponse.json(
        { 
          error: error.response.data?.message || error.response.data?.error || "Failed to create lead",
          details: error.response.data?.errors || error.response.data?.details || error.response.data || null
        },
        { status: error.response.status || 500 }
      );
    }
    // Handle network errors or other non-response errors
    if (error.request) {
      console.error("No response received from backend:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    return NextResponse.json(
      { error: "Failed to create lead", details: error.message },
      { status: 500 }
    );
  }
}

