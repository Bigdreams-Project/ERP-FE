"use client";
import AcademicTabs from "@/components/academic/common/AcademicTabs";
import BreadCrumb from "@/components/academic/common/BreadCrumb";
import FilterPopover from "@/components/academic/popover/Filter.popover";
import LeadTable from "@/components/academic/tables/Leads.table";
import LeadModal from "@/components/modals/academic/Lead.modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import { IoFilter } from "react-icons/io5";

export default function Leads() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    startDate: "",
    endDate: "",
  });

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

  const handleFilterChange = (newFilters: any) => {
    setFilterOptions(newFilters);
  };

  const filterItems = [
    {
      label: "Enquiry Date",
      name: "enquiryDate",
      type: "date",
      placeholder: "Search by date",
    },
  ];

  return (
    <div className="w-full">
      <BreadCrumb paths={[{ name: "Leads" }]} />
      <div className="w-full  flex items-center justify-between  text-center">
        <div className="flex items-center mt-4">
          <AcademicTabs />
        </div>

        <div className="flex items-center gap-1">
          <div className="w-full flex items-center justify-end gap-7 p-2">
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative">
                  <div className="flex items-center gap-2 p-2 rounded-md cursor-pointer bg-white border border-gray-200 hover:bg-gray-100 transition-colors">
                    <IoFilter size={20} />
                    <p className="font-medium text-gray-900">Filter</p>
                  </div>
                </div>
              </PopoverTrigger>

              <PopoverContent className="w-fit h-60 p-0">
                <FilterPopover
                  filterItems={filterItems}
                  initialFilters={filterOptions}
                  onApply={handleFilterChange}
                />
              </PopoverContent>
            </Popover>

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

      <LeadTable searchQuery={searchQuery} filterOptions={filterOptions} />
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        mode="add"
      />
    </div>
  );
}
