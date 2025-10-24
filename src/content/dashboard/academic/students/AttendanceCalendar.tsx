"use client";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { AttendanceRecord } from "@/types/requests/attendance";
import { getAttendance } from "@/lib/network";

interface CalendarDay {
  day: number | "";
  status: "present" | "absent" | "unmarked" | null;
}

interface AttendanceCalendarProps {
  studentId: string;
}

const AttendanceCalendar = ({ studentId }: AttendanceCalendarProps) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const queryKey = ["studentAttendance", studentId, currentYear, currentMonth];

  const { data: attendanceRecords = [], isLoading } = useQuery<
    AttendanceRecord[]
  >({
    queryKey: queryKey,
    queryFn: () => getAttendance(studentId, currentYear, currentMonth),
  });

  const attendanceMap = useMemo(() => {
    return attendanceRecords.reduce((acc, record) => {
      const dateKey = record.date.substring(0, 10);
      acc[dateKey] = record.status.toLowerCase() as "present" | "absent";
      return acc;
    }, {} as Record<string, "present" | "absent">);
  }, [attendanceRecords]);

  const generateCalendarDays = (date: Date): CalendarDay[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: CalendarDay[] = [];

    const todayDate = today.setHours(0, 0, 0, 0);
    const isCurrentMonth =
      month === today.getMonth() && year === today.getFullYear();

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: "", status: null });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        i
      ).padStart(2, "0")}`;

      const recordedStatus = attendanceMap[dateKey];
      let status: CalendarDay["status"] = null;

      if (recordedStatus) {
        status = recordedStatus;
      } else if (dayDate.setHours(0, 0, 0, 0) < todayDate) {
        status = "unmarked";
      }

      days.push({ day: i, status });
    }
    return days;
  };

  const calendarDays = useMemo(
    () => generateCalendarDays(selectedDate),
    [selectedDate, attendanceMap]
  );

  const handleMonthChange = (direction: "prev" | "next") => {
    setSelectedDate((prevDate) => {
      const newMonth = prevDate.getMonth() + (direction === "next" ? 1 : -1);
      return new Date(prevDate.getFullYear(), newMonth, 1);
    });
  };

  const currentMonthName = selectedDate.toLocaleString("default", {
    month: "long",
  });

  const getDayClasses = (status: CalendarDay["status"], day: number | "") => {
    if (!day) return "";

    let baseClasses =
      "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-150";

    if (status === "present") {
      return `${baseClasses} bg-emerald-500 text-white hover:bg-emerald-600`;
    }

    if (status === "absent") {
      return `${baseClasses} bg-rose-500 text-white hover:bg-rose-600`;
    }

    if (status === "unmarked") {
      return `${baseClasses} text-gray-700 bg-white border border-gray-300 hover:bg-gray-100`;
    }

    return `${baseClasses} text-gray-400 bg-transparent font-normal cursor-default`;
  };

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Attendance Record</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleMonthChange("prev")}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-lg font-semibold text-gray-700 w-32 text-center">
            {currentMonthName} {currentYear}
          </span>
          <button
            onClick={() => handleMonthChange("next")}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4 text-center text-gray-500 font-medium text-sm">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
          <div key={dayName} className="py-2">
            {dayName}
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2 text-gray-500">Loading attendance...</span>
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-4 text-center mt-2">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className="p-2 text-gray-900 font-medium flex items-center justify-center"
            >
              {day.day && (
                <span className={getDayClasses(day.status, day.day)}>
                  {day.day}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttendanceCalendar;
