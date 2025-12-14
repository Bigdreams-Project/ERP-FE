import { getLoggedInUser } from "@/lib/network";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await getLoggedInUser();
    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

