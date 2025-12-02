"use client";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getLoggedInUserClient } from "@/lib/client-network";
import { User } from "@/types/auth/user.interface";

/**
 * Client-side hook to check if the current user is an ADMIN
 * Uses React Query with the same query key as other components to share cache
 * @returns { isAdmin: boolean; isLoading: boolean }
 */
export function useIsAdmin() {
  // Use the same query key as overview page to share cache
  const queryOptions: UseQueryOptions<User> = {
    queryKey: ["user"],
    queryFn: () => getLoggedInUserClient(),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    // If data exists in cache, use it immediately (no loading state)
    cacheTime: 1000 * 60 * 10, // Keep in cache for 10 minutes (v4 API)
  };
  
  const { data: user, isLoading } = useQuery<User>(queryOptions);

  const isAdmin = user?.role ? String(user.role).trim().toUpperCase() === "ADMIN" : false;

  // If we have cached data, don't show loading state
  const isActuallyLoading = isLoading && !user;

  return { isAdmin, isLoading: isActuallyLoading };
}

