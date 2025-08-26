"use client";
import AcademicTabs from "@/components/academic/common/AcademicTabs";
import BreadCrumb from "@/components/academic/common/BreadCrumb";
import BatchTable from "@/components/academic/tables/Batches.table";
import BatchModal from "@/components/modals/academic/Batch.modal";
import { batches, batchStatus } from "@/data/mock/academic.data";
import { useEffect, useRef, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import { IoFilter } from "react-icons/io5";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Item } from "@radix-ui/react-dropdown-menu";
import { IBatch } from "@/types/academic/batch.interface";

export default function Batches() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    startDate: "",
    endDate: "",
  });
  const [filters, setFilters] = useState(filterOptions);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [dateFilterName, setDateFilterName] = useState("");
  const [isFilterDropdown, setIsFilterDropdown] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>({
    status: [],
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

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
    setFilters((prev) => ({ ...prev, startDate: formattedDate }));
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    const formattedDate = date ? format(date, "yyyy-MM-dd") : "";
    setFilters((prev) => ({ ...prev, endDate: formattedDate }));
  };

  const handleFilterChange = (filterCategory: string, value: string) => {
    setAppliedFilters((prev: any) => {
      const currentValues = prev[filterCategory];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item: string) => item !== value)
        : [...currentValues, value];
      return { ...prev, [filterCategory]: newValues };
    });
  };

  const handleClearAll = () => {
    setAppliedFilters({ status: [], courseType: [] });
  };

  const handleApplyFilter = () => {
    setIsFilterDropdown(false);
  };

  const filteredData = batches.filter((batch: IBatch) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      batch.code.toLowerCase().includes(query) ||
      batch.course.toLowerCase().includes(query) ||
      batch.faculty.toLowerCase().includes(query);

    const matchesStatus =
      appliedFilters.status.length === 0 ||
      appliedFilters.status.includes(batch.status);

    const batchDate = dateFilterName ? new Date(dateFilterName) : null;
    const matchesDateRange =
      !dateFilterName ||
      !startDate ||
      !endDate ||
      (batchDate! >= startDate && batchDate! <= endDate);

    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const filterItems = [
    {
      label: "Start Date",
      name: "startDate",
      type: "date",
      placeholder: "Search by start date",
    },
    {
      label: "End Date",
      name: "endDate",
      type: "date",
      placeholder: "Search by end date",
    },
    {
      label: "Created Date",
      name: "createdDate",
      type: "date",
      placeholder: "Search by created date",
    },
  ];

  return (
    <div className="w-full overflow-hidden">
      <BreadCrumb paths={[{ name: "Batches" }]} />

      <div className="w-full  flex items-center">
        <div className="flex items-center mt-4">
          <AcademicTabs />
        </div>
        <div className="w-full flex items-center justify-end gap-7 p-2">
          <div className="relative" ref={dropdownRef}>
            <div
              className="flex items-center gap-2 p-2 rounded-md cursor-pointer bg-white hover:bg-gray-100 transition-colors"
              onClick={() => setIsFilterDropdown(!isFilterDropdown)}
            >
              <IoFilter size={20} />
              <p className="font-medium text-gray-900">Filter</p>
            </div>
            {isFilterDropdown && (
              <div className="absolute right-0 mt-2 bg-white flex flex-row rounded-md z-50 animate-in fade-in-0 duration-300 shadow-lg shadow-gray-400">
                {dateFilterName && (
                  <div className="flex p-4 gap-4">
                    <DayPicker
                      mode="range"
                      selected={{ from: startDate, to: endDate }}
                      onSelect={(range) => {
                        setStartDate(range?.from);
                        setEndDate(range?.to);
                        setFilters((prev) => ({
                          ...prev,
                          startDate: range?.from
                            ? format(range.from, "yyyy-MM-dd")
                            : "",
                          endDate: range?.to
                            ? format(range.to, "yyyy-MM-dd")
                            : "",
                        }));
                      }}
                      className="rdp-small"
                    />
                  </div>
                )}

                <div className="bg-white w-[200px] p-4 pl-0 animate-in fade-in-0 duration-300 shadow-md shadow-gray-400">
                  <div className="flex flex-col gap-3">
                    <div className="pl-3">
                      <select
                        name="date"
                        id=""
                        className="w-fit px-0 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                        onChange={(e) => setDateFilterName(e.target.value)}
                      >
                        <option value="">Select</option>
                        {filterItems.map((item, index) => (
                          <option
                            key={index}
                            value={item.name}
                            className="font-bold"
                          >
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1 pl-4">
                      <p className="font-semibold text-gray-800">Status</p>
                      <ul className="flex flex-col gap-1">
                        {batchStatus.map((status) => (
                          <li
                            key={status}
                            className="flex items-center gap-2 text-sm text-gray-700"
                          >
                            <input
                              id={`status-${status}`}
                              type="checkbox"
                              checked={appliedFilters.status.includes(status)}
                              onChange={() =>
                                handleFilterChange("status", status)
                              }
                              className="w-4 h-4 rounded accent-blue-600"
                            />
                            <label
                              htmlFor={`status-${status}`}
                              className="cursor-pointer"
                            >
                              {status}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between gap-2 pl-4 mt-4 text-[14px]">
                      <button
                        onClick={handleClearAll}
                        className="flex-1 bg-red-500 text-white text-center rounded-md p-2 hover:bg-red-600 transition-colors"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={handleApplyFilter}
                        className="flex-1 bg-blue-600 text-white text-center rounded-md p-2 hover:bg-blue-700 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

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
            <span className="text-white text-sm">Add Batch</span>
          </button>
        </div>
      </div>

      <BatchTable searchQuery={searchQuery} filteredData={filteredData} />
      <BatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        mode="add"
      />
    </div>
  );
}
