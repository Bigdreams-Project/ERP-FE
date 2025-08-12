"use client";
import React from "react";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { FiChevronRight } from "react-icons/fi";
import { PiSignInFill } from "react-icons/pi";
import HouseIcon from "./svg/HouseIcon";
import GraduationCapIcon from "./svg/GraduationCapIcon";
import SettingsIcon from "./svg/SettingsIcon";
import ChartBarAxisXIcon from "./svg/ChartBarAxisXIcon";
import StaffIcon from "./svg/StaffIcon";
import MoneyIcon from "./svg/MoneyIcon";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarMenu = ({
    sidebarExpanded,
    isMobile,
}: {
    sidebarExpanded: boolean;
    isMobile: boolean;
}) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const hoverRef = useRef<HTMLDivElement | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<{
        top: number;
        left: number;
    } | null>(null);
    const pathname = usePathname();
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const isActiveDashboard = pathname === "/dashboard";
    const [showChevron, setShowChevron] = useState(false);

    useLayoutEffect(() => {
        if (hoveredIndex !== null && itemRefs.current[hoveredIndex]) {
            const rect = itemRefs.current[hoveredIndex]!.getBoundingClientRect();
            setDropdownPosition({
                top: rect.top,
                left: rect.right,
            });
        } else {
            setDropdownPosition(null);
        }
    }, [hoveredIndex]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !itemRefs.current[hoveredIndex ?? -1]?.contains(event.target as Node)
            ) {
                setHoveredIndex(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
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

    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;

        if (sidebarExpanded && !isMobile) {
            timeoutId = setTimeout(() => {
                setShowChevron(true);
            }, 300); // delay slightly after text shows
        } else {
            setShowChevron(false);
        }

        return () => clearTimeout(timeoutId);
    }, [sidebarExpanded, isMobile]);

    const sidebarMenu = [
        {
            label: "Academic",
            icon: (props: React.SVGProps<SVGSVGElement>) => (
                <GraduationCapIcon {...props} />
            ),
            links: [
                { label: "Overview", href: "/dashboard/academic/overview" },
                { label: "Leads", href: "/dashboard/academic/leads" },
                { label: "Centers", href: "/dashboard/academic/centers" },
                { label: "Students", href: "/dashboard/academic/students" },
                { label: "Courses", href: "/dashboard/academic/courses" },
                { label: "Batches", href: "/dashboard/academic/batches" },
            ],
        },
        {
            label: "Finance",
            icon: (props: React.SVGProps<SVGSVGElement>) => <MoneyIcon {...props} />,
            links: [
                { label: "Invoices", href: "/dashboard/invoices" },
                { label: "Payments", href: "/dashboard/payments" },
            ],
        },

        {
            label: "HR & Staffs",
            icon: (props: React.SVGProps<SVGSVGElement>) => <StaffIcon {...props} />,
            links: [
                { label: "Invoices", href: "/dashboard/invoices" },
                { label: "Payments", href: "/dashboard/payments" },
            ],
        },
        {
            label: "Reporting",
            icon: (props: React.SVGProps<SVGSVGElement>) => (
                <ChartBarAxisXIcon {...props} />
            ),
            links: [
                { label: "Invoices", href: "/dashboard/invoices" },
                { label: "Payments", href: "/dashboard/payments" },
            ],
        },
        {
            label: "Settings",
            icon: (props: React.SVGProps<SVGSVGElement>) => (
                <SettingsIcon {...props} />
            ),
            links: [
                { label: "Invoices", href: "/dashboard/invoices" },
                { label: "Payments", href: "/dashboard/payments" },
            ],
        },
    ];

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 ">
                <Link
                    href={"/dashboard"}
                    className={` flex text-center items-center  px-[1.5rem] py-[0.4rem] ${sidebarExpanded ? "" : "items-start !px-[2rem]"
                        } transition-all duration-500 font-inter ${isActiveDashboard ? "bg-indigo-50 text-indigo-500 font-bold" : ""
                        }`}
                >
                    <HouseIcon className="w-5 h-5  fill-current" />
                    <div
                        className={`pt-1 text-[16px]  transition-all duration-500  origin-left whitespace-nowrap overflow-hidden ${sidebarExpanded
                                ? "md:opacity-100 md:visible  md:ml-2 md:w-auto opacity-0 invisible ml-0 w-0"
                                : "opacity-0 invisible ml-0 w-0"
                            } ${!isActiveDashboard && "text-[rgba(0,0,0,0.7)]"}`}
                    >
                        Dashboard
                    </div>
                </Link>

                <div className="w-full flex flex-col justify-between">
                    {sidebarMenu.map((menu, index) => {
                        const isMenuActive = menu.links?.some((child) =>
                            pathname.startsWith(child.href)
                        );

                        return (
                            <div key={index}>
                                {/* Parent menu label and icon */}
                                <div
                                    ref={(el) => {
                                        itemRefs.current[index] = el;
                                    }}
                                    className={`flex !items-center justify-between font-inter mt-[0.5rem] text-[16px] cursor-pointer px-[1.5rem] py-[0.4rem] ${isMenuActive && "bg-indigo-50"
                                        }`}
                                    onClick={() => {
                                        setExpandedIndex(expandedIndex === index ? null : index);
                                        setHoveredIndex(index);
                                        if (hoveredIndex === index) {
                                            setHoveredIndex(null); // toggle off
                                        } else {
                                            setHoveredIndex(index); // toggle on
                                        }
                                    }}
                                >
                                    {/* Left Side: Icon and Label */}
                                    <div
                                        className={`flex items-center transition-all text-center justify-center font-inter duration-300 ease-in-out ${sidebarExpanded ? "" : "items-start !px-[0.5rem]"
                                            } `}
                                    >
                                        <span>
                                            {menu.icon({
                                                className: `${isMenuActive
                                                        ? "text-indigo-500"
                                                        : "text-[rgba(0,0,0,0.7)]"
                                                    } w-[20px] h-[20px]`,
                                            })}
                                        </span>

                                        <span
                                            className={`transition-all duration-300 origin-left whitespace-nowrap overflow-hidden ${sidebarExpanded
                                                    ? "md:opacity-100 md:scale-100 md:ml-2 md:w-auto opacity-0 scale-0 ml-0 w-0"
                                                    : "opacity-0 scale-0 ml-0 w-0"
                                                } text-[rgba(0,0,0,0.7)] font-inter ${isMenuActive && "text-indigo-500 font-bold"
                                                }`}
                                        >
                                            {menu.label}
                                        </span>
                                    </div>

                                    {/* Chevron Icon */}
                                    {sidebarExpanded && showChevron ? (
                                        <div
                                            className={`transform transition-all duration-500 ease-in-out text-[rgba(0,0,0,0.7)] ${expandedIndex === index ? "rotate-90" : "rotate-0"
                                                } md:opacity-100 md:scale-100 md:w-auto md:ml-2 ${isMenuActive && "text-indigo-500"
                                                }`}
                                        >
                                            <FiChevronRight size={20} />
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </div>

                                {/* Nested links */}
                                <div className="full relative">
                                    {sidebarExpanded && !isMobile ? (
                                        <div
                                            className={`overflow-hidden transition-all duration-500 flex flex-col gap-1 mt-1 ${expandedIndex === index ? "max-h-[400px]" : "max-h-0"
                                                }`}
                                        >
                                            {menu.links.map((link, i) => {
                                                return (
                                                    <Link
                                                        key={i}
                                                        href={link.href}
                                                        className={`block hover:bg-indigo-50 transition-all duration-300 pl-[3.2rem] px-[0.6rem] py-1 font-inter text-[rgba(0,0,0,0.7)] text-[16px] ${pathname === link.href
                                                                ? "font-bold text-[rgba(0,0,0,0.8)]"
                                                                : ""
                                                            }`}
                                                    >
                                                        {link.label}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        hoveredIndex === index &&
                                        dropdownPosition &&
                                        createPortal(
                                            <div
                                                className="fixed z-[9999] bg-white rounded-lg py-2 px-2 shadow-lg"
                                                style={{
                                                    top: dropdownPosition.top,
                                                    left: dropdownPosition.left,
                                                }}
                                                ref={dropdownRef}
                                            >
                                                <div className="text-[16px] font-inter">
                                                    {menu.links.map((link, i) => (
                                                        <Link
                                                            key={i}
                                                            href={link.href}
                                                            className={`block text-[rgba(0,0,0,0.7)] hover:bg-indigo-50 px-[0.6rem] py-1 ${pathname === link.href
                                                                    ? "font-bold text-[rgba(0,0,0,0.8)]"
                                                                    : ""
                                                                }`}
                                                        >
                                                            {link.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>,
                                            document.body
                                        )
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Sign out stays after all items */}
            <div
                className={` flex gap-1 border-t justify-center items-center text-[16px] cursor-pointer md:py-[0.7rem] px-[1rem] py-2 ${sidebarExpanded ? "" : "px-[0rem] pl-[0.1rem]"
                    }`}
            >
                {sidebarExpanded ? (
                    <div className="flex pr-[6rem]">
                        <PiSignInFill size={20} className="text-[rgba(0,0,0,0.7)]" />
                        <h1
                            className={`transition-all duration-500 whitespace-nowrap font-inter text-[rgba(0,0,0,0.7)] ${sidebarExpanded
                                    ? "opacity-100 visible ml-1"
                                    : "opacity-0 invisible ml-0 none"
                                }`}
                        >
                            Sign out
                        </h1>
                    </div>
                ) : (
                    <PiSignInFill size={20} className="text-[rgba(0,0,0,0.7)]" />
                )}
            </div>
        </div>
    );
};
export default SidebarMenu;
