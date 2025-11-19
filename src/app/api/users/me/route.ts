import { getLoggedInUser } from "@/lib/network";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getLoggedInUser();
    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Failed to fetch logged in user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

