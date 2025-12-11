"use client";
import { AuthRoutes } from "@/constants/apiRoutes.constant";
import { useCenter } from "@/context/CenterContext";
import { useUser } from "@/context/UserContext";
import { logoutUser } from "@/lib/auth/login";
import { getLoggedInUserClient } from "@/lib/client-network";
import { canAccessCentersPage } from "@/lib/utils/center-permissions";
import { User } from "@/types/auth/user.interface";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { PiSignInFill } from "react-icons/pi";
import GraduationCapIcon from "./svg/GraduationCapIcon";
import HouseIcon from "./svg/HouseIcon";
import MoneyIcon from "./svg/MoneyIcon";
import SettingsIcon from "./svg/SettingsIcon";

interface SidebarLink {
  label: string;
  href: string;
}

interface SidebarSection {
  label: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => any;
  links: SidebarLink[];
}

const SidebarMenu = ({
  sidebarExpanded,
  isMobile,
  toggleSidebar,
}: {
  sidebarExpanded: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}) => {
  const router = useRouter();
  const { user: userFromContext } = useUser();
  const { centerContext, isLoading: isCenterLoading } = useCenter();
  
  // Fallback to React Query if user is not in context
  const { data: userFromQuery } = useQuery<User>({
    queryKey: ["user"],
    queryFn: () => getLoggedInUserClient(),
    staleTime: 1000 * 60 * 5,
    enabled: !userFromContext, // Only fetch if not in context
  });
  
  // Use user from context if available, otherwise from query
  const user = userFromContext || userFromQuery;
  // const userPermissions = permissions[user?.role ?? "staff"];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const hoverRef = useRef<HTMLDivElement | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (hoveredIndex !== null && hoverRef.current) {
      const rect = hoverRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.top,
        left: rect.right,
      });
    } else {
      setDropdownPosition(null);
    }
  }, [hoveredIndex]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        hoverRef.current &&
        !hoverRef.current.contains(event.target as Node)
      ) {
        setHoveredIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [showChevron, setShowChevron] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (sidebarExpanded && !isMobile) {
      timeoutId = setTimeout(() => {
        setShowChevron(true);
      }, 300);
    } else {
      setShowChevron(false);
    }

    return () => clearTimeout(timeoutId);
  }, [sidebarExpanded, isMobile]);

  const logout = () => {
    logoutUser();
    router.push(AuthRoutes.LOGIN);
  };

  // Determine if user can access the Centers page
  // ONLY ADMIN, CEO, and EXECUTIVE_DIRECTOR should see the Centers page
  // This is different from canSwitchCenters which includes more roles
  const canAccessCenters = canAccessCentersPage(user?.role);

  // Sidebar Menu
  const sidebarMenu: SidebarSection[] = [
    {
      label: "Academic",
      icon: (props) => <GraduationCapIcon {...props} />,
      links: [
        { label: "Overview", href: "/dashboard/academic/overview" },
        { label: "Leads", href: "/dashboard/academic/leads" },
        // Only show Centers link for ADMIN, CEO, EXECUTIVE_DIRECTOR
        // Show while loading to prevent flicker
        ...(canAccessCenters || isCenterLoading
          ? [{ label: "Centers", href: "/dashboard/academic/centers" }]
          : []),
        { label: "Students", href: "/dashboard/academic/students" },
        { label: "Courses", href: "/dashboard/academic/courses" },
        { label: "Batches", href: "/dashboard/academic/batches" },
        { label: "Internship", href: "/dashboard/academic/internship" },
        { label: "NICTP", href: "/dashboard/academic/nictp" },
      ],
    },
    {
      label: "Finance",
      icon: (props) => <MoneyIcon {...props} />,
      links: [
        { label: "Overview", href: "/dashboard/finance/overview" },
        {
          label: "Transactions",
          href: "/dashboard/finance/banking/banks",
        },
        {
          label: "Refunds",
          href: "/dashboard/finance/refunds",
        },
        // { label: "Fee Plans", href: "/dashboard/finance/fee-plans" },
        // {
        //   label: "Payments & Receipts",
        //   href: "/dashboard/finance/payments-receipts",
        // },
        // { label: "Payroll", href: "/dashboard/finance/payroll" },
        // {
        //   label: "Franchise Tracking",
        //   href: "/dashboard/finance/franchise-tracking",
        // },
        // { label: "Expenses", href: "/dashboard/finance/expenses" },
      ],
    },
    // {
    //   label: "HR & Staffs",
    //   icon: (props) => <StaffIcon {...props} />,
    //   links: [
    //     { label: "Overview", href: "/dashboard/hr-staff/overview" },
    //     { label: "Invoices", href: "/dashboard/hr-staff/invoices" },
    //     { label: "Payments", href: "/dashboard/hr-staff/payments" },
    //   ],
    // },
    // {
    //   label: "Reporting",
    //   icon: (props) => <ChartBarAxisXIcon {...props} />,
    //   links: [
    //     { label: "Invoices", href: "/dashboard/reporting/invoices" },
    //     { label: "Payments", href: "/dashboard/reporting/payments" },
    //   ],
    // },
    {
      label: "Settings",
      icon: (props) => <SettingsIcon {...props} />,
      links: [
        {
          label: "User Management",
          href: "/dashboard/settings/users",
        },
        {
          label: "Support Tickets",
          href: "/dashboard/settings/tickets",
        },
      ],
    },
  ];

  const isActiveDashboard = pathname === "/dashboard";

  return (
    <div className="h-full flex flex-col flex-1 mt-8">
      <div className="flex-1">
        <Link
          href={"/dashboard"}
          className={`flex items-center px-[1.5rem] py-[0.4rem] ${
            sidebarExpanded ? "" : "items-start !px-[2rem]"
          } transition-all duration-500 font-inter ${
            isActiveDashboard ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-300 font-bold" : ""
          }`}
          onClick={(e) => {
            if (!sidebarExpanded) {
              e.preventDefault();
              toggleSidebar();
            }
          }}
        >
          <HouseIcon className="w-5 h-5 fill-current" />
          <div
            className={`pt-1 text-[16px] transition-all duration-500 origin-left whitespace-nowrap overflow-hidden ${
              sidebarExpanded
                ? "md:opacity-100 md:visible md:ml-2 md:w-auto opacity-0 invisible ml-0 w-0"
                : "opacity-0 invisible ml-0 w-0"
            } ${!isActiveDashboard && "text-[rgba(0,0,0,0.7)] dark:text-gray-300"}`}
            onClick={() => {
              if (!sidebarExpanded) toggleSidebar();
            }}
          >
            Dashboard
          </div>
        </Link>

        {/* Sidebar Sections */}
        <div className="w-full flex flex-col justify-between">
          {sidebarMenu.map((menu, index) => {
            const isMenuActive = menu.links.some((link) =>
              pathname.startsWith(link.href)
            );

            return (
              <div key={index}>
                {/* Section header */}
                <div
                  ref={hoverRef}
                  className={`flex items-center justify-between font-inter mt-[0.5rem] text-[16px] cursor-pointer px-[1.5rem] py-[0.4rem] ${
                    isMenuActive && "bg-indigo-50 dark:bg-indigo-900/30"
                  }`}
                  onClick={() => {
                    if (!sidebarExpanded) {
                      toggleSidebar();
                    } else {
                      setExpandedIndex(expandedIndex === index ? null : index);
                      setHoveredIndex(index);
                    }
                  }}
                >
                  {/* Icon + Label */}
                  <div className="flex items-center">
                    {menu.icon({
                      className: `${
                        isMenuActive
                          ? "text-indigo-500 dark:text-indigo-300"
                          : "text-[rgba(0,0,0,0.7)] dark:text-gray-300"
                      } w-[20px] h-[20px]`,
                    })}
                    <span
                      className={`transition-all duration-300 origin-left whitespace-nowrap overflow-hidden ${
                        sidebarExpanded
                          ? "md:opacity-100 md:scale-100 md:ml-2 md:w-auto opacity-0 scale-0 ml-0 w-0"
                          : "opacity-0 scale-0 ml-0 w-0"
                      } text-[rgba(0,0,0,0.7)] dark:text-gray-300 font-inter ${
                        isMenuActive && "text-indigo-500 dark:text-indigo-300 font-bold"
                      }`}
                    >
                      {menu.label}
                    </span>
                  </div>

                  {sidebarExpanded && showChevron && (
                    <div
                      className={`transform transition-all duration-500 ease-in-out ${
                        expandedIndex === index ? "rotate-90" : "rotate-0"
                      } ${isMenuActive && "text-indigo-500 dark:text-indigo-300"}`}
                    >
                      <FiChevronRight size={20} />
                    </div>
                  )}
                </div>

                {/* Links */}
                {sidebarExpanded && (
                  <div
                    className={`overflow-hidden transition-all duration-500 flex flex-col gap-1 mt-1 ${
                      expandedIndex === index ? "max-h-[400px]" : "max-h-0"
                    }`}
                  >
                    {menu.links.map((link, i) => (
                      <Link
                        key={i}
                        href={link.href}
                        onClick={() => {
                          if (!sidebarExpanded) toggleSidebar();
                        }}
                        className={`block hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-300 pl-[3.2rem] px-[0.6rem] py-1 font-inter text-[rgba(0,0,0,0.7)] dark:text-gray-300 text-[16px] ${
                          pathname === link.href
                            ? "font-bold text-[rgba(0,0,0,0.8)] dark:text-indigo-300"
                            : ""
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sign out */}
      <div
        className={`flex gap-1 border-t border-gray-300 dark:border-gray-700 justify-center items-center text-[16px] cursor-pointer md:py-[0.7rem] px-[1rem] py-2 ${
          sidebarExpanded ? "" : "px-[0rem] pl-[0.1rem]"
        }`}
      >
        {sidebarExpanded ? (
          <div className="flex pr-[6rem]" onClick={logout}>
            <PiSignInFill size={20} className="text-red-600" />
            <h1 className="ml-1 text-red-600">Sign out</h1>
          </div>
        ) : (
          <PiSignInFill size={20} className="text-[rgba(0,0,0,0.7)] dark:text-gray-300" />
        )}
      </div>
    </div>
  );
};

export default SidebarMenu;
