"use client";
import { useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
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
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [displayRange, setDisplayRange] = useState("");

  const handleSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setRange([ranges.selection]);
    setDisplayRange(
      `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`
    );

    setStartDate(startDate.toLocaleDateString());
    setEndDate(endDate.toLocaleDateString());
    setFilters((prev) => ({ startDate, endDate }));
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
          </div>
        ))}
      </div>

      {/* Date range */}
      <div className="mb-4">
        <input
          type="text"
          readOnly
          value={displayRange || "Select a date range"}
          className="w-full px-3 py-2 text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Date Picker */}
      <div className=" bg-white rounded-lg">
        <DateRangePicker
          ranges={range}
          onChange={handleSelect}
          moveRangeOnFirstSelection={false}
          className="text-black"
        />
      </div>

      <div className="flex flex-row items-center justify-end gap-2 mt-4 pt-2 text-[14px] border-t border-gray-300">
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
