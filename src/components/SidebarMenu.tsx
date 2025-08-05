import React from "react";
import { useState, useEffect, useRef } from "react";

// icons
import { FiChevronRight } from "react-icons/fi";

import { PiSignInFill } from "react-icons/pi";


import HouseIcon from "./svg/HouseIcon";
import GraduationCapIcon from "./svg/GraduationCapIcon";
import SettingsIcon from "./svg/SettingsIcon";
import ChartBarAxisXIcon from "./svg/ChartBarAxisXIcon";
import StaffIcon from "./svg/StaffIcon";
import MoneyIcon from "./svg/MoneyIcon";
import Link from "next/link";

const SidebarMenu = ({ sidebarExpanded, isMobile }: { sidebarExpanded: boolean; isMobile: boolean }) => {

    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const hoverRef = useRef<HTMLDivElement | null>(null);


    //  Close hover menu on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (hoverRef.current && !hoverRef.current.contains(event.target as Node)) {
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
            }, 300); // delay slightly after text shows
        } else {
            setShowChevron(false);
        }

        return () => clearTimeout(timeoutId);
    }, [sidebarExpanded, isMobile]);

    const iconCondition = sidebarExpanded ? "20" : "25"
    // nexted items
    const sidebarMenu = [
        {
            label: "Academic",
            icon: <GraduationCapIcon className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />,
            links: [
                { label: "Leads", href: "/dashboard/dynamic/leads" },
                { label: "Centers", href: "/dashboard/dynamic/centers" },
                { label: "Students", href: "/dashboard/dynamic/students" },
                { label: "Courses", href: "/dashboard/dynamic/courses-batches" },
                { label: "Batches", href: "/dashboard/dynamic/courses-batches" },
            ],
        },
        {
            label: "Finance",
            icon: <MoneyIcon className="w-5 h-5 text-[rgba(0,0,0,0.6)]" />,
            links: [
                { label: "Invoices", href: "/dashboard/invoices" },
                { label: "Payments", href: "/dashboard/payments" },
            ],
        },

        {
            label: "HR & Staffs",
            icon: <StaffIcon  className="w-5 h-5 text-[rgba(0,0,0,0.6)]"/>,
            links: [
                { label: "Invoices", href: "/dashboard/invoices" },
                { label: "Payments", href: "/dashboard/payments" },
            ],
        },
        {
            label: "Reporting",
            icon: <ChartBarAxisXIcon className="w-5 h-5 text-[rgb(0,0,0)]" />,
            links: [
                { label: "Invoices", href: "/dashboard/invoices" },
                { label: "Payments", href: "/dashboard/payments" },
            ],
        },
        {
            label: "Settings",
            icon: <SettingsIcon className="w-5 h-5 text-[rgb(0,0,0)]"/>,
            links: [
                { label: "Invoices", href: "/dashboard/invoices" },
                { label: "Payments", href: "/dashboard/payments" },
            ],
        },
    ];


    return (

        <div className="h-full flex flex-col">

            <div className="flex-1 ">
                <Link href={"/dashboard"} className={`flex text-center items-center    text-indigo-500 px-[1.5rem] py-[0.4rem] ${sidebarExpanded ? " bg-indigo-50" : "items-start !px-[2rem]"} transition-all duration-500 font-inter`}>
                   <HouseIcon className="w-5 h-5 text-indigo-500 fill-current" />
                    <div
                        className={`font-bold text-[16px] text-indigo-500 transition-all duration-500  origin-left whitespace-nowrap overflow-hidden ${sidebarExpanded ? "md:opacity-100 md:visible  md:ml-2 md:w-auto opacity-0 invisible ml-0 w-0" : "opacity-0 invisible ml-0 w-0"}`} >

                        Dashboard
                    </div>

                </Link>

                <div className="w-full  flex flex-col justify-between">
                    {
                        sidebarMenu.map((menu, index) => (

                            <div key={index}>
                                {/*  // parent menu label and icon */}
                                <div
                                    ref={hoverRef}
                                    className="flex !items-center justify-between font-inter mt-[0.5rem] text-[16px] cursor-pointer px-[1.5rem] py-[0.4rem]"
                                    onClick={() => {

                                        setExpandedIndex(expandedIndex === index ? null : index)
                                        setHoveredIndex(index)
                                        if (hoveredIndex === index) {
                                            setHoveredIndex(null); // toggle off
                                        } else {
                                            setHoveredIndex(index); // toggle on
                                        }
                                    }
                                    }

                                >
                                    {/* Left Side: Icon and Label */}
                                    <div
                                        className={`flex items-center transition-all  text-center justify-center font-inter duration-300 ease-in-out ${sidebarExpanded ? "" : "items-start !px-[0.5rem]"} hover:`}>
                                        <span>{menu.icon}</span>

                                        {/* Animated label: always in DOM, but transitions based on sidebarExpanded */}
                                        <span
                                            className={`transition-all duration-300 origin-left whitespace-nowrap overflow-hidden ${sidebarExpanded ? "md:opacity-100 md:scale-100 md:ml-2 md:w-auto opacity-0 scale-0 ml-0 w-0" : "opacity-0 scale-0 ml-0 w-0"} text-[rgba(0,0,0,0.7)] font-inter`}>
                                            {menu.label}
                                        </span>
                                    </div>


                                    {/* Right Side: Chevron Icon (always rendered, animated based on sidebarExpanded) */}
                                    {sidebarExpanded && showChevron ? (
                                        <div
                                            className={`transform transition-all duration-500 ease-in-out text-[rgba(0,0,0,0.7)]  ${expandedIndex === index ? "rotate-90 " : "rotate-0"
                                                } md:opacity-100 md:scale-100 md:w-auto md:ml-2`}
                                        >
                                            <FiChevronRight size={20} />
                                        </div>

                                    )
                                        :
                                        ""
                                    }

                                </div>



                                {/* Nested links if this section is expanded */}
                                <div className="full relative">
                                    {
                                        sidebarExpanded && !isMobile ?
                                            <div className={`overflow-hidden transition-all duration-500  ${expandedIndex === index ? "max-h-[400px]" : "max-h-0"
                                                }`} >



                                                {menu.links.map((link, i) => (
                                                    <Link key={i} href={link.href} className="block  hover:bg-indigo-50 transition-all duration-300 pl-[3.2rem] px-[0.6rem] py-1 font-inter focus:bg-bghover text-[rgba(0,0,0,0.7)] text-[16px]">
                                                        <span>{link.label}</span>
                                                    </Link>
                                                ))}

                                            </div>
                                            :
                                            hoveredIndex === index &&

                                            <div className={`absolute  z-50 left-16  bg-white top-[-25px] w-[170px] rounded-lg py-2 px-2 ${hoveredIndex === index ? 'animate-dropdown-in' : 'animate-dropdown-out'}`} style={{ boxShadow: "0rem 0rem 0.1rem 0rem rgba(65,64,64,0.5)" }}>

                                                {
                                                    hoveredIndex === index &&
                                                    <div className={`text-[16px] font-inter   ${hoveredIndex === index ? 'animate-dropdown-in visible' : 'animate-dropdown-out invisible'}`}>
                                                        {menu.links.map((link, i) => (
                                                            <Link
                                                                key={i}
                                                                href={link.href}
                                                                className="block text-[rgba(0,0,0,0.7)] hover:bg-indigo-50 transition-all duration-300 px-[0.6rem] py-1 focus:bg-bghover font-inter"

                                                            >
                                                                {link.label}
                                                            </Link>


                                                        ))}
                                                    </div>
                                                }
                                            </div>
                                    }
                                </div>

                            </div>
                        ))
                    }


                </div>
            </div>

            {/* Sign out stays after all items */}
            <div
                className={` flex gap-1 border-t justify-center items-center text-[16px] cursor-pointer md:py-[0.7rem] px-[1rem] py-2 ${sidebarExpanded ? "" : "px-[0rem] pl-[0.1rem]"
                    }`}>
                {
                    sidebarExpanded ?
                        <div className="flex pr-[6rem]">
                             <PiSignInFill size={20} className="text-[rgba(0,0,0,0.7)]"/>
                            <h1
                                className={`transition-all duration-500 whitespace-nowrap font-inter text-[rgba(0,0,0,0.7)] ${sidebarExpanded ? "opacity-100 visible ml-1" : "opacity-0 invisible ml-0 none"
                                    }`}>
                                Sign out
                            </h1>
                        </div>
                        :
                        <PiSignInFill size={20} className="text-[rgba(0,0,0,0.7)]"/>
                }

            </div>
        </div>
    )

}
export default SidebarMenu;
