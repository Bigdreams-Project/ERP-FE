"use client";
import AcademicTabs from "@/components/academic/common/AcademicTabs";
import BreadCrumb from "@/components/academic/common/BreadCrumb";
import BatchTable from "@/components/academic/tables/Batches.table";
import BatchModal from "@/components/modals/academic/Batch.modal";
import { batchStatus } from "@/data/mock/academic.data";
import { Batch, Faculty } from "@/types/academic/batch.interface";
import { Course } from "@/types/academic/course.interface";
import { Student } from "@/types/academic/student.interface";
import { useEffect, useRef, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "react-day-picker/dist/style.css";
import { BiSearchAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import { IoFilter } from "react-icons/io5";

interface BatchesContentProps {
  batches: Batch[];
  courses: Course[];
  students: Student[];
  faculties: Faculty[];
}

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

const BatchesContent = ({
  batches,
  courses,
  students,
  faculties,
}: BatchesContentProps) => {
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

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [displayRange, setDisplayRange] = useState("");
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

  const handleSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setRange([ranges.selection]);
    setDisplayRange(
      `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
    );
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handleSave = () => {
    console.log("...");
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
    setDateFilterName("");
  };

  const handleApplyFilter = () => {
    setIsFilterDropdown(false);
    setDateFilterName("");
  };

  const filteredData = batches.filter((batch) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      batch.code.toLowerCase().includes(query) ||
      batch.faculty?.fullname?.toLowerCase().includes(query);

    const matchesStatus =
      appliedFilters.status.length === 0 ||
      appliedFilters.status.includes(batch.status);

    // 👇 Date filtering
    const matchesDateRange =
      !startDate ||
      !endDate ||
      filterItems.some((item) => {
        const fieldValue = (batch as any)[item.name];
        if (!fieldValue) return false;
        const fieldDate = new Date(fieldValue);
        return fieldDate >= startDate && fieldDate <= endDate;
      });

    return matchesSearch && matchesStatus && matchesDateRange;
  });

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
              onClick={() => {
                setIsFilterDropdown(!isFilterDropdown);
                setDateFilterName("");
              }}
            >
              <IoFilter size={20} />
              <p className="font-medium text-gray-900">Filter</p>
            </div>
            {isFilterDropdown && (
              <div
                className={`absolute ${
                  dateFilterName ? "-right-60" : "right-0"
                } mt-2 pt-1 bg-white flex flex-row rounded-md z-50 animate-in fade-in-0 duration-300 border-t border-gray-300 shadow-lg shadow-gray-400`}
              >
                {dateFilterName && (
                  <div className="p-1">
                    {/* Date range */}
                    <div className="mb-2 px-2">
                      <input
                        type="text"
                        readOnly
                        value={displayRange || "Select a date range"}
                        className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Date Picker */}
                    <div className="bg-white">
                      <DateRangePicker
                        ranges={range}
                        onChange={handleSelect}
                        moveRangeOnFirstSelection={false}
                        className="text-black"
                      />
                    </div>
                  </div>
                )}

                <div className="bg-white w-[200px] p-4 pl-0 animate-in fade-in-0 duration-300 shadow-md shadow-gray-400">
                  <div className="flex flex-col gap-3">
                    <div className="pl-3">
                      <select
                        name="date"
                        id=""
                        className="w-fit font-bold px-0 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                        onChange={(e) => setDateFilterName(e.target.value)}
                      >
                        <option value="">Select a date</option>
                        {filterItems.map((item, index) => (
                          <option
                            key={index}
                            value={item.name}
                            className="font-medium"
                          >
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1 pl-4">
                      <p className="font-semibold text-gray-800">Status</p>
                      <ul className="flex flex-col gap-1">
                        {batchStatus?.map((status) => (
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

      <BatchTable
        searchQuery={searchQuery}
        filteredData={filteredData}
        courses={courses}
        students={students}
        faculties={faculties}
      />
      <BatchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        courses={courses}
        students={students}
        faculties={faculties}
        mode="add"
      />
    </div>
  );
};

export default BatchesContent;
