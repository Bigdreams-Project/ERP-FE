"use client";
import AcademicTabs from "@/components/academic/common/AcademicTabs";
import BreadCrumb from "@/components/academic/common/BreadCrumb";
import CenterTable from "@/components/academic/tables/Center.table";
import CenterModal from "@/components/modals/academic/Center.modal";
import { createCenter } from "@/lib/network";
import { showError, showSuccess } from "@/lib/toast";
import { Center, Manager } from "@/types/academic/center.interface";
import { CreateCenter } from "@/types/requests/center.interface";
import { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";

interface CenterContentProps {
  centers: Center[];
  managers: Manager[];
}

const CenterContent = ({ centers, managers }: CenterContentProps) => {
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

  const handleSave = async (payload: CreateCenter, isDraft: boolean) => {
    try {
      await createCenter(payload, isDraft);
      showSuccess("Center created successfully");
      setIsModalOpen(false);
    } catch (error) {
      showError("Failed to save lead");
      console.error("Failed to save lead:", error);
    }
  };

  return (
    <div className="w-full">
      <BreadCrumb paths={[{ name: "Centers" }]} />

      <div className="w-full flex items-center">
        <div className="flex items-center mt-4">
          <AcademicTabs />
        </div>
        <div className="w-full flex items-center justify-end gap-7 p-2">
          <div className="w-[250px]">
            <div className="flex items-center gap-1 py-1.5 border-2 rounded focus-within:outline-2 focus-within:outline-indigo-500 transition-all duration-100 placeholder:text-[rgba(0,0,0,0.7)]">
              <BiSearchAlt size={18} className="ml-2" />
              <input
                type="text"
                placeholder="Search"
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (!isTyping) setIsTyping(true);
                }}
                className="outline-none"
              />
            </div>
          </div>

          <button
            className="flex items-center justify-between gap-2 px-3 py-2 text-white bg-add-button rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus className="text-white" size={16} />
            <span className="text-white text-sm">Add Center</span>
          </button>
        </div>
      </div>

      <CenterTable
        searchQuery={searchQuery}
        centers={centers}
        managers={managers}
      />
      <CenterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        managers={managers}
        mode="add"
      />
    </div>
  );
};

export default CenterContent;
