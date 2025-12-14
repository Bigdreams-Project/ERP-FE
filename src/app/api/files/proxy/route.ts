import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

/**
 * GET handler - Proxy S3 image files with authentication
 * Gets presigned URL from backend and proxies the image to frontend
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get("url");
    const fileId = searchParams.get("fileId");

    if (!fileUrl && !fileId) {
      return NextResponse.json(
        { error: "Either 'url' or 'fileId' parameter is required" },
        { status: 400 }
      );
    }

    let presignedUrl: string | null = null;

    // If fileId is provided, try to get presigned URL from backend
    if (fileId) {
      try {
        // Try to get file info first
        const fileResponse = await axios.get(
          `${AuthRoutes.BASE_URL}/files/${fileId}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const file = fileResponse.data;
        
        // Check if file has presignedUrl
        if (file.presignedUrl) {
          presignedUrl = file.presignedUrl;
        } else if (file.fileUrl) {
          // If fileUrl is already presigned, use it
          if (file.fileUrl.includes('?') || file.fileUrl.includes('X-Amz-')) {
            presignedUrl = file.fileUrl;
          } else {
            // Try to get presigned URL for this file
            try {
              const presignedResponse = await axios.post(
                `${AuthRoutes.BASE_URL}/files/${fileId}/presigned-url`,
                {},
                {
                  headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    "Content-Type": "application/json",
                  },
                }
              );
              presignedUrl = presignedResponse.data.presignedUrl || presignedResponse.data.url;
            } catch (presignedError: any) {
              // If presigned URL endpoint doesn't exist, use the fileUrl directly
              console.log("Presigned URL endpoint not available, using fileUrl:", file.fileUrl);
              presignedUrl = file.fileUrl;
            }
          }
        }
      } catch (error: any) {
        console.error("Failed to get file info:", error);
        return NextResponse.json(
          { error: "Failed to get file information" },
          { status: 500 }
        );
      }
    } else if (fileUrl) {
      // If URL is provided and already presigned, use it
      if (fileUrl.includes('?') || fileUrl.includes('X-Amz-')) {
        presignedUrl = fileUrl;
      } else {
        // Regular S3 URL - try to get presigned URL from backend
        // Extract file path from S3 URL
        try {
          const s3Url = new URL(fileUrl);
          const filePath = s3Url.pathname.substring(1); // Remove leading /

          const presignedResponse = await axios.post(
            `${AuthRoutes.BASE_URL}/files/presigned-url`,
            { filePath },
            {
              headers: {
                Authorization: `Bearer ${session.accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          presignedUrl = presignedResponse.data.presignedUrl || presignedResponse.data.url;
        } catch (error: any) {
          // If presigned URL endpoint doesn't exist, use the URL directly
          console.log("Presigned URL endpoint not available, using provided URL:", fileUrl);
          presignedUrl = fileUrl;
        }
      }
    }

    if (!presignedUrl) {
      return NextResponse.json(
        { error: "Could not determine image URL" },
        { status: 400 }
      );
    }

    // Fetch the image using the presigned URL
    try {
      const imageResponse = await axios.get(presignedUrl, {
        responseType: "arraybuffer",
        validateStatus: (status) => status < 500, // Don't throw on 403/404
      });

      if (imageResponse.status !== 200) {
        console.error("Failed to fetch image, status:", imageResponse.status);
        return NextResponse.json(
          { error: "Failed to fetch image" },
          { status: imageResponse.status }
        );
      }

      // Determine content type
      const contentType =
        imageResponse.headers["content-type"] ||
        (presignedUrl.includes(".jpg") || presignedUrl.includes(".jpeg")
          ? "image/jpeg"
          : presignedUrl.includes(".png")
          ? "image/png"
          : "image/jpeg");

      // Return the image with proper headers
      return new NextResponse(imageResponse.data, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=3600", // Cache for 1 hour
        },
      });
    } catch (error: any) {
      console.error("Failed to fetch image:", error);
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Failed to proxy image:", error);
    if (error.response) {
      return NextResponse.json(
        {
          error:
            error.response.data?.message ||
            error.response.data?.error ||
            "Failed to proxy image",
        },
        { status: error.response.status || 500 }
      );
    }
    return NextResponse.json(
      { error: "Failed to proxy image" },
      { status: 500 }
    );
  }
}

