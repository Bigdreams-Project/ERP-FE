import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: studentId } = await params;
    const body = await request.json();

    const response = await axios.patch(
      `${AuthRoutes.BASE_URL}/students/${studentId}/enroll-program`,
      body,
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
        { error: error.response.data?.message || "Failed to enroll student to program" },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to enroll student to program" },
      { status: 500 }
    );
  }
}

