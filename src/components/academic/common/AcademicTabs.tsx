"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCenter } from "@/context/CenterContext";
import { useUser } from "@/context/UserContext";
import { canAccessCentersPage } from "@/lib/utils/center-permissions";
import { useQuery } from "@tanstack/react-query";
import { getLoggedInUserClient } from "@/lib/client-network";
import { User } from "@/types/auth/user.interface";

const tabs = [
  { label: "Overview", href: "/dashboard/academic/overview" },
  { label: "Leads", href: "/dashboard/academic/leads" },
  { label: "Centers", href: "/dashboard/academic/centers" },
  { label: "Students", href: "/dashboard/academic/students" },
  { label: "Courses", href: "/dashboard/academic/courses" },
  { label: "Batches", href: "/dashboard/academic/batches" },
  { label: "Internship", href: "/dashboard/academic/internship" },
  { label: "NICTP", href: "/dashboard/academic/nictp" },
];

export default function AcademicTabs() {
  const pathname = usePathname();
  const { centerContext, isLoading } = useCenter();
  const { user: userFromContext } = useUser();
  
  // Fallback to React Query if user is not in context
  const { data: userFromQuery } = useQuery<User>({
    queryKey: ["user"],
    queryFn: () => getLoggedInUserClient(),
    staleTime: 1000 * 60 * 5,
    enabled: !userFromContext, // Only fetch if not in context
  });
  
  // Use user from context if available, otherwise from query
  const user = userFromContext || userFromQuery;
  
  // Filter out Centers tab - only ADMIN, CEO, EXECUTIVE_DIRECTOR should see it
  // This is different from canSwitchCenters which includes more roles
  const canAccessCenters = canAccessCentersPage(user?.role);
  
  const visibleTabs = isLoading 
    ? tabs // Show all tabs while loading
    : tabs.filter(tab => tab.label !== "Centers" || canAccessCenters);

  return (
    <div className="w-full transition-all duration-500 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mb-4 font-inter overflow-hidden">
      <div className="flex overflow-x-auto scrollbar-hide border border-gray-200 dark:border-gray-700">
        {visibleTabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              href={tab.href}
              key={tab.href}
              className={`flex items-center text-center px-4 py-2 text-[14px] font-medium transition-colors duration-500 whitespace-nowrap flex-shrink-0 ${
                isActive 
                  ? "text-gray-900 dark:text-gray-100" 
                  : "text-gray-600 dark:text-gray-400"
              } hover:text-gray-900 dark:hover:text-gray-100`}
              style={{
                border: "1px solid transparent",
                borderBottom: isActive ? "4px solid #6366f1" : "",
              }}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
