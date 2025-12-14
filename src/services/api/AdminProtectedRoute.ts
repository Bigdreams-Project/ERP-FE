/**
 * Reusable Admin-Protected API Route Handler
 * Provides standardized authentication, authorization, and error handling
 * for all admin-protected API routes
 */

import { isAdmin } from "@/lib/auth/role-check";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

export interface RouteHandlerParams {
  request: NextRequest;
  params: Promise<{ id: string }>;
}

export interface RouteHandlerContext {
  session: {
    accessToken: string;
    user: {
      id: string;
      email: string;
    };
  };
  id: string;
  body?: any;
  searchParams?: URLSearchParams;
}

export type RouteHandler<T = any> = (
  context: RouteHandlerContext
) => Promise<T>;

export interface RouteOptions {
  requireBody?: boolean;
  requireHardDeleteParam?: boolean;
}

/**
 * Creates an admin-protected API route handler
 * Handles: session validation, admin check, error handling
 * 
 * @param handler - The actual route logic
 * @param options - Route configuration options
 * @returns Next.js route handler function
 */
export function createAdminProtectedRoute<T = any>(
  handler: RouteHandler<T>,
  options: RouteOptions = {}
) {
  return async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ): Promise<NextResponse> => {
    try {
      // 1. Validate session
      const session = await getSession();
      if (!session) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }

      // 2. Check admin role
      const adminCheck = await isAdmin();
      if (!adminCheck) {
        return NextResponse.json(
          { error: "Forbidden: Admin access required" },
          { status: 403 }
        );
      }

      // 3. Extract route parameters
      const { id } = await params;
      const url = new URL(request.url);
      const searchParams = url.searchParams;
      
      // 4. Parse request body if needed
      let body: any = undefined;
      if (options.requireBody || request.method === "PATCH" || request.method === "POST") {
        try {
          body = await request.json();
        } catch {
          // Body is optional for some routes
        }
      }

      // 5. Validate hard delete parameter if needed
      if (options.requireHardDeleteParam) {
        const hard = searchParams.get("hard") === "true";
        if (!hard) {
          return NextResponse.json(
            { error: "Hard delete requires ?hard=true parameter" },
            { status: 400 }
          );
        }
      }

      // 6. Create context for handler
      const context: RouteHandlerContext = {
        session: {
          accessToken: session.accessToken,
          user: session.user,
        },
        id,
        body,
        searchParams,
      };

      // 7. Execute handler
      const result = await handler(context);

      // 8. Return success response
      return NextResponse.json(result);
    } catch (error: any) {
      // Handle axios errors (from backend calls)
      if (error.response) {
        return NextResponse.json(
          {
            error: error.response.data?.message || error.response.data?.error || "Request failed",
          },
          { status: error.response.status || 500 }
        );
      }

      // Handle other errors
      return NextResponse.json(
        { error: error.message || "Internal server error" },
        { status: 500 }
      );
    }
  };
}

