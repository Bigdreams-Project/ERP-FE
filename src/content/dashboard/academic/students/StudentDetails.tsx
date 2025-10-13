"use client";
import { studentData } from "@/data/view/student.data";
import { updateStudent } from "@/lib/network";
import { showError, showSuccess } from "@/lib/toast";
import { formatDate } from "@/lib/utils";
import { Student } from "@/types/academic/student.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  CalendarDays,
  CircleUserRound,
  Clock,
  Coins,
  FileText,
  Home,
  MailIcon,
  Percent,
  PhoneIcon,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";

interface StudentDetailsProps {
  student: Student;
}

const StudentDetails = ({ student }: StudentDetailsProps) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState<Student>(student);

  const { mutate: saveStudent, isPending } = useMutation({
    mutationFn: async (updatedStudent: Student | any) => {
      return await updateStudent(updatedStudent.id!, updatedStudent);
    },
    onSuccess: () => {
      showSuccess("Student updated successfully");
      setIsEditing(false);
      queryClient.invalidateQueries(["students"]);
      queryClient.invalidateQueries(["student", student.id]);
    },
    onError: (error: any) => {
      console.error(error);
      showError("Failed to update student");
    },
  });

  const handleEditToggle = () => {
    if (isEditing) {
      console.log("Data:", formData);
      saveStudent(formData);
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(student);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderSection = (title: string, content: string, Icon: any) => (
    <div className="bg-white px-2 py-4 rounded-lg flex items-center mb-4">
      {Icon && (
        <div className="text-xl mr-3 text-gray-500">
          <Icon size={20} />
        </div>
      )}
      <div className="flex-1">
        <div className="font-semibold text-gray-800">{title}</div>
        <div className="text-sm text-gray-600">{content}</div>
      </div>
    </div>
  );

  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    // Add empty placeholders for the days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: "", status: null });
    }

    // Add the actual days of the month with random attendance data
    for (let i = 1; i <= daysInMonth; i++) {
      // Simple random attendance simulation
      const isPresent = Math.random() > 0.25; // 75% present, 25% absent
      days.push({
        day: i,
        status: isPresent ? "present" : "absent",
      });
    }
    return days;
  };

  // Generate the calendar days using useMemo for performance
  const calendarDays = useMemo(
    () => generateCalendarDays(selectedDate),
    [selectedDate]
  );

  // Handle month/year change from the dropdown
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [month, year] = e.target.value.split("-").map(Number);
    setSelectedDate(new Date(year, month, 1));
  };

  // Get the month and year options for the dropdown
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = [2023, 2024, 2025];

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 relative left-[-7px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-chevron-left"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <p className="text-indigo-600 hover:text-indigo-800 font-medium">
              Academic &gt; Students &gt; {student.fullName}
            </p>
          </div>
          <a
            href="/dashboard/academic/students"
            className="mt-2 text-blue-600 hover:underline text-sm font-semibold flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
              />
            </svg>
            Back to Students List
          </a>
        </div>
        <div className="flex items-center space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditToggle}
                className="flex items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <button
                // onClick={handleEditToggle}
                className="flex gap-2 items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <MdEdit />
                Edit
              </button>
              <button
                onClick={handleEditToggle}
                className="flex gap-2 items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <MdEdit />
                Payment
              </button>
            </>
          )}
        </div>
      </div>

      <h2 className="text-3xl font-extrabold mb-6 text-gray-900">
        Student Profile: {student.fullName}
      </h2>

      <div className="bg-white rounded-lg w-full max-w-6xl py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left */}
        <div className="lg:col-span-2 p-4 pt-6 border-t border-gray-300 rounded-lg shadow-md shadow-gray-400">
          <div className="flex flex-col items-center">
            {student.image ? (
              <Image
                src={student.image}
                alt="action"
                width={128}
                height={128}
                priority
                className="rounded-full object-cover"
              />
            ) : (
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-gray-200">
                <CircleUserRound className="w-full h-full text-gray-400" />
              </div>
            )}

            <div className="text-xl font-semibold text-gray-800">
              {student.fullName}
            </div>
            <div className="text-sm text-gray-500">{student.studentId}</div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              General Information
            </h3>
            <div className="space-y-4">
              {renderSection(
                "Created Date",
                formatDate(student.createdAt),
                CalendarDays
              )}
              {renderSection(
                "Course",
                student.courses.length > 0
                  ? student.courses[0]?.name
                  : "Not yet enrolled.",
                BookOpen
              )}
              {renderSection("Batch", student.batches[0]?.code, Users)}
              {renderSection(
                "Dates",
                `${formatDate(student.batches[0]?.startDate)} - ${formatDate(
                  student.batches[0]?.endDate
                )}`,
                Clock
              )}
              <div className="bg-white p-4 rounded-lg flex items-center">
                <div className="text-xl mr-3 text-gray-500">
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">Status</div>
                  <div className="w-full text-sm text-gray-600 bg-white border-none focus:ring-0">
                    <span>{student.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              Contact Information
            </h3>
            <div className="space-y-4">
              {renderSection("Email", student.email, MailIcon)}
              {renderSection("Phone", student.phone, PhoneIcon)}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              Financial & Attendance
            </h3>
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-lg flex items-center">
                <div className="text-xl mr-3 text-gray-500">
                  <Coins size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">
                    Payment Status
                  </div>
                  <div className="text-sm text-gray-600 flex items-center justify-between">
                    <span>{studentData.financialInfo.paymentStatus}</span>
                    <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      Paid
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg flex items-center">
                <div className="text-xl mr-3 text-gray-500">
                  <Percent size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">Attendance</div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <div className="w-full h-2 bg-blue-200 rounded-full mr-2">
                      <div
                        className="bg-blue-500 h-full rounded-full"
                        style={{
                          width: `${studentData.financialInfo.attendance}%`,
                        }}
                      ></div>
                    </div>
                    <span>{studentData.financialInfo.attendance}%</span>
                  </div>
                </div>
              </div>
              {renderSection(
                "Next Payment Due",
                studentData.financialInfo.nextPaymentDue,
                CalendarDays
              )}
            </div>
          </div>
          <button className="mt-8 w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors">
            Add Note
          </button>
        </div>

        {/* Right */}
        <div className="lg:col-span-2 space-y-8 p-4 border-t border-gray-300 rounded-lg shadow-md shadow-gray-400">
          {/* Home Address */}
          <div className="bg-white py-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Home Address
            </h3>
            {renderSection("", student.address, Home)}
          </div>
          <div className="bg-white py-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Parent/Guardian
            </h3>
            {renderSection("Name", student.guardians[0]?.fullname, User)}
            {renderSection("Email", student.guardians[0]?.email, MailIcon)}
          </div>

          {/* Payment History */}
          <div className="bg-white py-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Payment History
            </h3>
            <div className="h-64 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
              <span className="text-sm">
                Payment history will be displayed here.
              </span>
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-2">Notes</h3>
            <div className="space-y-2">
              {student?.notes?.map(
                (note, index) =>
                  note.note && (
                    <div className="mb-4">
                      <p
                        key={index}
                        className="text-sm text-gray-400 font-medium mb-1"
                      >
                        <span className="font-medium">
                          {formatDate(note.createdAt || note.updatedAt)}
                        </span>
                      </p>
                      <p>{note.note}</p>
                    </div>
                  )
              )}
            </div>
            <button className="mt-4 text-blue-600 text-sm font-medium p-3 shadow-md shadow-gray-400 rounded-md flex items-center space-x-1">
              <IoMdAdd />
              <span>Add note</span>
            </button>
          </div>

          {/* Attendance Records */}
          <div className="py-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Attendance Record
              </h3>
              <div className="relative inline-block text-left">
                <select
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all duration-300"
                  onChange={handleMonthChange}
                  value={`${selectedDate.getMonth()}-${selectedDate.getFullYear()}`}
                >
                  {years.map((year) =>
                    months.map((monthName, monthIndex) => (
                      <option
                        key={`${monthIndex}-${year}`}
                        value={`${monthIndex}-${year}`}
                      >
                        {monthName} {year}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-4 text-center text-gray-500 font-medium text-sm">
              <div className="py-2">Sun</div>
              <div className="py-2">Mon</div>
              <div className="py-2">Tue</div>
              <div className="py-2">Wed</div>
              <div className="py-2">Thu</div>
              <div className="py-2">Fri</div>
              <div className="py-2">Sat</div>
            </div>

            <div className="grid grid-cols-7 gap-4 text-center mt-2">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className="p-2 text-gray-900 font-medium flex items-center justify-center"
                >
                  {day.day && (
                    <span
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                                  ${
                                    day.status === "present"
                                      ? "bg-emerald-500"
                                      : ""
                                  }
                                  ${
                                    day.status === "absent" ? "bg-rose-500" : ""
                                  }`}
                    >
                      {day.day}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
