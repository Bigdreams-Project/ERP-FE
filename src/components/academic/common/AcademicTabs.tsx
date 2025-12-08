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
    <div className="min-w-full transition-all duration-500 border border-gray-200 bg-white mb-4 font-inter ">
      <div className="flex" style={{ border: "1px solid #f5f5f5" }}>
        {visibleTabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              href={tab.href}
              key={tab.href}
              className={`flex items-center text-center px-4 py-2 text-[14px] font-medium transition-colors duration-500 text-[rgba(0,0,0,0.7)]`}
              style={{
                border: "1px solid #f5f5f5",
                borderBottom: isActive ? "4px solid #6366f1" : "",
                color: isActive ? "black" : "",
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
