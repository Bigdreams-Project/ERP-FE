'use client'
import AcademicTabs from "@/components/academiccomponents/AcademicTabs";
import BreadCrumb from "@/components/academiccomponents/BreadCrumb";
import CenterTable from "@/components/academiccomponents/CenterTable";
import { BiSearchAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import { useState, useEffect } from "react";

export default function centers() {
    // Inside centers component
    const [searchQuery, setSearchQuery] = useState("");
    const [searchInput, setSearchInput] = useState(""); // stores live input
    const [showMinLengthError, setShowMinLengthError] = useState(false);
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchInput.length >= 2 || searchInput.length === 0) {
                setSearchQuery(searchInput);
                setShowMinLengthError(false); // hide error
            } else {
                setShowMinLengthError(true); // show error if only 1 character
            }
        }, 900); // Wait 800ms after user stops typing

        return () => clearTimeout(delayDebounce);
    }, [searchInput]);


    return (
        <div className="w-full">
            <BreadCrumb paths={[{ name: "Centers" }]} />
            <div className="w-full  flex items-center justify-between  text-center">
                <div className="flex items-center mt-4">
                    <AcademicTabs />
                </div>
                <div className="flex items-center gap-1">
                    <div className="flex flex-col w-[200px] gap-1">

                        <div className="flex items-center gap-1 outline-2 outline-[rgba(0,0,0,0.2)] rounded focus-within:outline-2 focus-within:outline-[rgba(0,0,0,0.7)] transition-all duration-100 placeholder:text-[rgba(0,0,0,0.7)] px-1">
                            <BiSearchAlt size={20}/>
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full px-1 py-1 outline-none"
                            />
                        </div>

                        {showMinLengthError && (
                            <p className="text-red-500 text-[8px] ">
                                Please enter at least two characters to search.
                            </p>
                        )}
                    </div>
                    <div className="p-6">
                        <button className="flex items-center gap-3">
                            <FaPlus className="text-indigo-500" />
                            <span className="text-[rgba(0,0,0,0.7)] ">add center</span>
                        </button>
                    </div>
                </div>
            </div>

            <CenterTable searchQuery={searchQuery} />
        </div>
    )
}