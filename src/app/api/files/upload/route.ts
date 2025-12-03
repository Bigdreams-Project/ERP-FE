import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";

/**
 * POST handler - Upload file to S3 and save to database
 * Accepts FormData with file, studentId, and fileType
 * Proxies request to backend to handle S3 upload and database save
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse FormData from request
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const studentId = formData.get("studentId") as string | null;
    const fileType = formData.get("fileType") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 }
      );
    }

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    if (!fileType || (fileType !== "payment_receipt" && fileType !== "profile_image")) {
      return NextResponse.json(
        { error: "File type must be 'payment_receipt' or 'profile_image'" },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedMimeTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed. Only PDF, JPG, and PNG are accepted." },
        { status: 400 }
      );
    }

    // Create FormData for backend using form-data package
    // Convert the File to a Buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const backendFormData = new FormData();
    backendFormData.append("file", fileBuffer, {
      filename: file.name,
      contentType: file.type,
    });
    backendFormData.append("studentId", studentId);
    backendFormData.append("fileType", fileType);

    // Proxy to backend
    const response = await axios.post(
      `${AuthRoutes.BASE_URL}/files/upload`,
      backendFormData,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
          ...backendFormData.getHeaders(),
        },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Failed to upload file:", error);
    if (error.response) {
      return NextResponse.json(
        {
          error:
            error.response.data?.message ||
            error.response.data?.error ||
            "Failed to upload file",
        },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

