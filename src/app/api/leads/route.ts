import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { CreateLead } from "@/types/requests/lead.interface";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * GET handler - Fetch all leads
 * Proxies request to backend to avoid CORS issues
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await axios.get(`${AuthRoutes.BASE_URL}/leads/active`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to fetch leads:", error);
    if (error.response) {
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
 */
export async function POST(request: NextRequest) {
  let payload: CreateLead | null = null;
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    payload = await request.json();

    const response = await axios.post(
      `${AuthRoutes.BASE_URL}/leads`,
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

