"use client";
import { useState, useEffect, useRef } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Calendar, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DateRangeSelectorProps {
  range: Array<{
    startDate: Date;
    endDate: Date;
    key: string;
  }>;
  onChange: (range: Array<{ startDate: Date; endDate: Date; key: string }>) => void;
}

type QuickSelection = "today" | "lastWeek" | "lastMonth" | "thisMonth" | "thisQuarter" | "thisYear" | "custom";

const DateRangeSelector = ({ range, onChange }: DateRangeSelectorProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [selectedQuick, setSelectedQuick] = useState<QuickSelection | null>(null);
  const customPickerRef = useRef<HTMLDivElement>(null);

  // Detect current selection on mount
  useEffect(() => {
    const start = range[0].startDate;
    const end = range[0].endDate;
    const today = new Date();
    
    // Check if it matches any quick selection
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);
    
    if (start.toDateString() === todayStart.toDateString() && end.toDateString() === todayEnd.toDateString()) {
      setSelectedQuick("today");
      return;
    }
    
    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(today.getDate() - 7);
    lastWeekStart.setHours(0, 0, 0, 0);
    const lastWeekEnd = new Date(today);
    lastWeekEnd.setHours(23, 59, 59, 999);
    
    if (start.toDateString() === lastWeekStart.toDateString() && end.toDateString() === lastWeekEnd.toDateString()) {
      setSelectedQuick("lastWeek");
      return;
    }
    
    // Check other ranges...
    // For now, if no match, leave as custom
  }, [range]);

  // Close custom picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (customPickerRef.current && !customPickerRef.current.contains(event.target as Node)) {
        setShowCustomPicker(false);
      }
    };

    if (showCustomPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCustomPicker]);

  const getQuickRange = (selection: QuickSelection) => {
    const today = new Date();
    const start = new Date();
    const end = new Date();

    switch (selection) {
      case "today":
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case "lastWeek":
        start.setDate(today.getDate() - 7);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case "lastMonth":
        start.setMonth(today.getMonth() - 1);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(today.getMonth());
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        break;
      case "thisMonth":
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case "thisQuarter":
        const quarter = Math.floor(today.getMonth() / 3);
        start.setMonth(quarter * 3);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth((quarter + 1) * 3);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        break;
      case "thisYear":
        start.setMonth(0);
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
        end.setMonth(11);
        end.setDate(31);
        end.setHours(23, 59, 59, 999);
        break;
      default:
        return null;
    }

    return { startDate: start, endDate: end, key: "selection" };
  };

  const handleQuickSelect = (selection: QuickSelection) => {
    if (selection === "custom") {
      setShowPicker(false);
      setShowCustomPicker(true);
      return;
    }

    const newRange = getQuickRange(selection);
    if (newRange) {
      onChange([newRange]);
      setSelectedQuick(selection);
      setShowPicker(false);
      setShowCustomPicker(false);
    }
  };

  const handleDatePickerSelect = (ranges: any) => {
    onChange([ranges.selection]);
    setShowCustomPicker(false);
    setSelectedQuick("custom");
  };

  const formatDisplayRange = () => {
    const start = range[0].startDate;
    const end = range[0].endDate;
    
    if (selectedQuick === "today") return "Today";
    if (selectedQuick === "lastWeek") return "Last 7 Days";
    if (selectedQuick === "lastMonth") return "Last Month";
    if (selectedQuick === "thisMonth") return "This Month";
    if (selectedQuick === "thisQuarter") return "This Quarter";
    if (selectedQuick === "thisYear") return "This Year";
    
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff === 0) return "Today";
    if (daysDiff === 6) return "Last 7 Days";
    
    return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  };

  return (
    <div className="relative">
      <DropdownMenu open={showPicker} onOpenChange={setShowPicker}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar size={16} className="text-gray-500" />
            <span>{formatDisplayRange()}</span>
            <ChevronDown size={16} className="text-gray-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 p-2">
          <div className="space-y-0.5">
            <DropdownMenuItem
              onClick={() => handleQuickSelect("today")}
              className="cursor-pointer text-sm py-2"
            >
              Today
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleQuickSelect("lastWeek")}
              className="cursor-pointer text-sm py-2"
            >
              Last 7 Days
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleQuickSelect("lastMonth")}
              className="cursor-pointer text-sm py-2"
            >
              Last Month
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleQuickSelect("thisMonth")}
              className="cursor-pointer text-sm py-2"
            >
              This Month
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleQuickSelect("thisQuarter")}
              className="cursor-pointer text-sm py-2"
            >
              This Quarter
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleQuickSelect("thisYear")}
              className="cursor-pointer text-sm py-2"
            >
              This Year
            </DropdownMenuItem>
            <div className="border-t border-gray-200 my-1"></div>
            <DropdownMenuItem
              onClick={() => handleQuickSelect("custom")}
              className="cursor-pointer text-sm py-2"
            >
              Custom Range
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {showCustomPicker && (
        <div ref={customPickerRef} className="absolute right-0 z-50 mt-2 bg-white shadow-2xl rounded-xl p-4 border border-gray-200">
          <DateRangePicker
            ranges={range}
            onChange={handleDatePickerSelect}
            moveRangeOnFirstSelection={false}
          />
        </div>
      )}
    </div>
  );
};

export default DateRangeSelector;

