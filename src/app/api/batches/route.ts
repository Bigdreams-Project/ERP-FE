import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { CreateBatch } from "@/types/requests/batch.interface";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * GET handler - Fetch all batches
 * Proxies request to backend to avoid CORS issues
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await axios.get(`${AuthRoutes.BASE_URL}/batches`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to fetch batches:", error);
    if (error.response) {
      return NextResponse.json(
        { error: error.response.data?.message || "Failed to fetch batches" },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch batches" },
      { status: 500 }
    );
  }
}

/**
 * POST handler - Create a new batch
 * Proxies request to backend to avoid CORS issues
 */
export async function POST(request: NextRequest) {
  let payload: CreateBatch | null = null;
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    payload = await request.json();

    const response = await axios.post(
      `${AuthRoutes.BASE_URL}/batches`,
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
    console.error("Failed to create batch:", error);
    if (payload) {
      console.error("Payload sent:", JSON.stringify(payload, null, 2));
    }
    if (error.response) {
      console.error("Backend error response:", error.response.data);
      return NextResponse.json(
        { error: error.response.data?.message || error.response.data || "Failed to create batch" },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create batch" },
      { status: 500 }
    );
  }
}

