"use client";
import {
  DownloadIcon,
  EditIcon,
  PrintIcon,
  ShareIcon,
} from "@/components/ui/icons";
import { studentData } from "@/data/view/student.data";
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
import { useState } from "react";

const Student = () => {
  const [course, setCourse] = useState(studentData);
  const [isEditable, setIsEditable] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setCourse((prevLead) => ({
      ...prevLead,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      console.log("Saving center data:", course);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCourse(studentData);
  };

  const toggleEdit = () => {
    setIsEditable(!isEditable);
  };

  const renderSection = (title: string, content: string, Icon: any) => (
    <div className="bg-gray-100 px-2 py-4 rounded-lg flex items-center mb-4">
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
              Academic &gt; Students &gt; {studentData.name}
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
                onClick={handleEditToggle}
                className="flex items-center px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <EditIcon />
                Edit
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-blue-600 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                <DownloadIcon />
                <span>Download</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-blue-600 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                <PrintIcon />
                <span>Print</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 border border-blue-600 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
                <ShareIcon />
                <span>Share</span>
              </button>
            </>
          )}
        </div>
      </div>

      <h2 className="text-3xl font-extrabold mb-6 text-gray-900">
        Student Profile: {studentData.name}
      </h2>

      <div className="bg-white rounded-lg w-full max-w-6xl py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left */}
        <div className="lg:col-span-2 p-4 pt-6 border-t border-gray-300 rounded-lg shadow-md shadow-gray-400">
          <div className="flex flex-col items-center">
            {studentData.profileImage ? (
              <Image
                src={studentData.profileImage}
                alt="action"
                width={128}
                height={128}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-gray-200">
                <CircleUserRound className="w-full h-full text-gray-400" />
              </div>
            )}

            <div className="text-xl font-semibold text-gray-800">
              {studentData.name}
            </div>
            <div className="text-sm text-gray-500">{studentData.studentId}</div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              General Information
            </h3>
            <div className="space-y-4">
              {renderSection(
                "Created Date",
                studentData.generalInfo.createdDate,
                CalendarDays
              )}
              {renderSection(
                "Course",
                studentData.generalInfo.course,
                BookOpen
              )}
              {renderSection("Batch", studentData.generalInfo.batch, Users)}
              {renderSection("Dates", studentData.generalInfo.dates, Clock)}
              <div className="bg-gray-100 p-4 rounded-lg flex items-center">
                <div className="text-xl mr-3 text-gray-500">
                  <FileText size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">Status</div>
                  <select className="w-full text-sm text-gray-600 bg-gray-100 border-none focus:ring-0">
                    <option>{studentData.generalInfo.status}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-700 mb-4">
              Contact Information
            </h3>
            <div className="space-y-4">
              {renderSection("Email", studentData.contactInfo.email, MailIcon)}
              {renderSection("Phone", studentData.contactInfo.phone, PhoneIcon)}
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
          <div className="bg-white py-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Home Address
            </h3>
            {renderSection("", studentData.homeAddress.address, Home)}
          </div>
          <div className="bg-white py-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Parent/Guardian
            </h3>
            {renderSection("Name", studentData.parentGuardian.name, User)}
            {renderSection("Email", studentData.parentGuardian.email, MailIcon)}
          </div>
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
        </div>
      </div>
    </div>
  );
};

export default Student;
