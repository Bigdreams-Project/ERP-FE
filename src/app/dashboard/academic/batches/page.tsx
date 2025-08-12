"use client";
import AcademicTabs from "@/components/academic/common/AcademicTabs";
import BreadCrumb from "@/components/academic/common/BreadCrumb";
import BatchTable from "@/components/academic/tables/Batches.table";
import { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";

export default function Batches() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!isTyping && searchInput.length > 0) {
      setIsTyping(true);
    }

    const handler = setTimeout(() => {
      if (searchInput.length === 0) {
        setSearchQuery("");
        setError("");
      } else if (searchInput.length < 3) {
        setError("Please enter at least 3 characters");
      } else {
        setError("");
        setSearchQuery(searchInput);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  return (
    <div className="w-full overflow-hidden">
      <BreadCrumb paths={[{ name: "Batches" }]} />

      <div className="w-full  flex items-center">
        <div className="flex items-center mt-4">
          <AcademicTabs />
        </div>
        <div className="w-full flex  justify-end gap-7 p-2">
          <div className="w-[220px] h-[20px] ">
            <div className="flex items-center  gap-1 outline-[rgba(0,0,0,0.2)] rounded focus-within:outline-2 focus-within:outline-indigo-500 transition-all duration-100 placeholder:text-[rgba(0,0,0,0.7)]">
              <BiSearchAlt size={17} />
              <input
                type="text"
                placeholder="Search"
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (!isTyping) setIsTyping(true);
                }}
              />
            </div>
            {error && (
              <span className="text-red-500 text-[10px] mt-1">{error}</span>
            )}
          </div>

          <div className="">
            <button className="flex items-center gap-2">
              <FaPlus className="text-indigo-500" />
              <span className="text-[#9095A0FF] ">Add Batch</span>
            </button>
          </div>
        </div>
      </div>

      <BatchTable searchQuery={searchQuery} />
    </div>
  );
}
