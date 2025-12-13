"use server";
import { getLoggedInUser } from "@/lib/network";
import { User } from "@/types/auth/user.interface";

/**
 * Server-side function to check if the current user is an ADMIN
 * @returns Promise<boolean> - true if user is ADMIN, false otherwise
 */
export async function isAdmin(): Promise<boolean> {
  try {
    const user = await getLoggedInUser();
    return user?.role === "ADMIN";
  } catch (error) {
    console.error("Failed to check admin status:", error);
    return false;
  }
}

/**
 * Server-side function to get the current user's role
 * @returns Promise<string | null> - user role or null if not found
 */
export async function getUserRole(): Promise<string | null> {
  try {
    const user = await getLoggedInUser();
    return user?.role || null;
  } catch (error) {
    console.error("Failed to get user role:", error);
    return null;
  }
}

/**
 * Server-side function to check if the current user can approve refunds
 * Only CEO, ADMIN, and Regional Manager can approve refunds
 * @returns Promise<boolean> - true if user can approve refunds, false otherwise
 */
export async function canApproveRefunds(): Promise<boolean> {
  try {
    const user = await getLoggedInUser();
    const role = user?.role?.toUpperCase();
    return role === "CEO" || role === "ADMIN" || role === "REGIONAL_MANAGER";
  } catch (error) {
    console.error("Failed to check refund approval permission:", error);
    return false;
  }
}

