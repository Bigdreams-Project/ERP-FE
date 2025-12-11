import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { isAdmin } from "@/lib/auth/role-check";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { UpdateArchiveRecord } from "@/types/requests/archive.interface";

/**
 * GET handler - Fetch a single archive record
 * Admin only
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Archive ID is required" },
        { status: 400 }
      );
    }

    // Call backend API to get archive record
    const response = await axios.get(`${AuthRoutes.BASE_URL}/archive/${id}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to fetch archive record:", error);
    if (error.response) {
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          error.response.data?.details ||
                          `Backend error: ${error.response.statusText}`;
      console.error("Backend error details:", error.response.data);
      return NextResponse.json(
        { error: errorMessage },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to fetch archive record" },
      { status: 500 }
    );
  }
}

/**
 * PATCH handler - Update an archive record
 * Admin only
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let id: string | undefined;
  let payload: UpdateArchiveRecord | null = null;
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    id = resolvedParams.id;
    payload = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Archive ID is required" },
        { status: 400 }
      );
    }

    // Call backend API to update archive record
    const response = await axios.patch(
      `${AuthRoutes.BASE_URL}/archive/${id}`,
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
    console.error("Failed to update archive record:", error);
    if (error.response) {
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          error.response.data?.details ||
                          `Backend error: ${error.response.statusText}`;
      console.error("Backend error details:", error.response.data);
      if (id) {
        console.error("Archive ID:", id);
      }
      if (payload) {
        console.error("Payload:", JSON.stringify(payload, null, 2));
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to update archive record" },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler - Delete an archive record
 * Admin only
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let id: string | undefined;
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin role
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required" },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    id = resolvedParams.id;

    if (!id) {
      return NextResponse.json(
        { error: "Archive ID is required" },
        { status: 400 }
      );
    }

    // Call backend API to delete archive record
    const response = await axios.delete(`${AuthRoutes.BASE_URL}/archive/${id}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to delete archive record:", error);
    if (error.response) {
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          error.response.data?.details ||
                          `Backend error: ${error.response.statusText}`;
      console.error("Backend error details:", error.response.data);
      if (id) {
        console.error("Archive ID:", id);
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to delete archive record" },
      { status: 500 }
    );
  }
}
