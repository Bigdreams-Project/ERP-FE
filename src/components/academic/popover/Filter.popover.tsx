"use client";
import { useState } from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

type FilterItem = {
  label: string;
  name: string;
  type: string;
  placeholder: string;
};

type Props = {
  filterItems: FilterItem[];
  initialFilters: { [key: string]: string };
  onApply: (filters: { [key: string]: string }) => void;
};

export default function FilterPopover({
  filterItems,
  initialFilters,
  onApply, 
}: Props) {
  const [filters, setFilters] = useState(initialFilters);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
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

  const handleApply = () => {
    onApply(filters);
  };

  const handleClear = () => {
    const clearedFilters = filterItems.reduce((acc: any, item) => {
      acc[item.name] = "";
      return acc;
    }, {});
    setFilters(clearedFilters);
    setStartDate(undefined);
    setEndDate(undefined);
    onApply({ ...clearedFilters, startDate: "", endDate: "" });
  };

  return (
    <div className="p-4 h-96 overflow-y-auto custom-scroll bg-white rounded-lg shadow-lg shadow-gray-400">
      <div className="space-y-4">
        {filterItems.map((item) => (
          <div key={item.name}>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              {item.label}
            </label>

            {item.type === "date" ? (
              <div className="flex gap-4">
                <div className="flex-1">
                  <DayPicker
                    mode="single"
                    selected={startDate}
                    onSelect={handleStartDateChange}
                    className="rdp-small"
                  />
                </div>

                <div className="flex-1">
                  <DayPicker
                    mode="single"
                    selected={endDate}
                    onSelect={handleEndDateChange}
                    className="rdp-small"
                  />
                </div>
              </div>
            ) : (
              <input
                type={item.type}
                name={item.name}
                value={filters[item.name] || ""}
                onChange={handleInputChange}
                placeholder={item.placeholder}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-row items-center justify-end gap-2 mt-4 text-[14px] border-t border-gray-500">
        <button
          onClick={handleClear}
          className="bg-red-500 w-36 text-white text-center rounded-md p-2 hover:bg-red-600 transition-colors"
        >
          Clear All
        </button>

        <button
          onClick={handleApply}
          className="bg-blue-600 w-36 text-white text-center rounded-md p-2 hover:bg-blue-700 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
}
