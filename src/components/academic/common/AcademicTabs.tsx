"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCenter } from "@/context/CenterContext";

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
  
  // Filter out Centers tab if user cannot switch centers (center manager)
  const canSwitch = centerContext?.canSwitch ?? false;
  const visibleTabs = isLoading 
    ? tabs // Show all tabs while loading
    : tabs.filter(tab => tab.label !== "Centers" || canSwitch);

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
