"use client";
import AcademicTabs from "@/components/academic/common/AcademicTabs";
import BreadCrumb from "@/components/academic/common/BreadCrumb";
import LeadTable from "@/components/academic/tables/Leads.table";
import LeadModal from "@/components/modals/academic/Lead.modal";
import { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";

export default function Leads() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleSave = () => {
    console.log("...");
  };

  return (
    <div className="w-full">
      <BreadCrumb paths={[{ name: "Leads" }]} />

      <div className="w-full  flex items-center justify-between  text-center">
        <div className="flex items-center mt-4">
          <AcademicTabs />
        </div>
        <div className="flex items-center gap-1">
          <div className="w-full flex items-center justify-end gap-7 p-2">
            <div className="w-[220px]">
              <div className="flex items-center gap-1 py-1 outline-[rgba(0,0,0,0.2)] rounded focus-within:outline-2 focus-within:outline-indigo-500 transition-all duration-100 placeholder:text-[rgba(0,0,0,0.7)]">
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

            <button
              className="flex items-center justify-between gap-2 px-3 py-2 text-white bg-add-button rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => setIsModalOpen(true)}
            >
              <FaPlus className="text-white" size={16} />
              <span className="text-white text-sm">Add Lead</span>
            </button>
          </div>
        </div>
      </div>

      <LeadTable searchQuery={searchQuery} />
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        mode="add"
      />
    </div>
  );
}
