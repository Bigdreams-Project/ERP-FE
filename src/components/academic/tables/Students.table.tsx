"use client";
import { students } from "@/data/mock/academic.data";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import Pagination from "../common/Pagination";

type Props = {
  searchQuery: string;
};

export default function StudentTable({ searchQuery }: Props) {
  const [data] = useState(students);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const itemsPerPage = 10;

  const filteredData = data.filter((student) => {
    const query = searchQuery.toLowerCase();
    return (
      student.fullName.toLowerCase().includes(query) ||
      student.email.toLowerCase().includes(query) ||
      student.phone.toLowerCase().includes(query) ||
      student.address.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className=" text-primary">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleEnroll = (studentId: string) => {
    console.log(`Enrolling student with ID: ${studentId}`);
    setOpenDropdown(null);
  };

  const handleView = (studentId: string) => {
    console.log(`Viewing student with ID: ${studentId}`);
    setOpenDropdown(null);
  };

  const handleEdit = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (student) {
      window.location.href = `mailto:${student.email}`;
    }
    setOpenDropdown(null);
  };

  const handleDelete = (studentId: string) => {
    console.log(`Deleting student with ID: ${studentId}`);
    setOpenDropdown(null);
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedData.map((center) => center.id);
    const allSelected = currentPageIds.every((id) =>
      selectedStudents.includes(id)
    );

    if (allSelected) {
      setSelectedStudents((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    } else {
      setSelectedStudents((prev) => [
        ...prev,
        ...currentPageIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  return (
    <div className="min-h-screen font-inter text-gray-200">
      <div className="bg-white rounded-lg shadow-xl relative overflow-hidden">
        <div className="w-full">
          <table className="w-full relative border-collapse text-[14px] text-gray-700 pb-2">
            <thead className="">
              <tr className="font-inter font-medium text-[13px] text-left text-gray-500 bg-gray-100">
                <th className="p-4 flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      paginatedData.length > 0 &&
                      paginatedData.every((center) =>
                        selectedStudents.includes(center.id)
                      )
                    }
                    onChange={handleSelectAll}
                    className="mr-2 accent-primary align-middle"
                  />{" "}
                  #
                </th>
                <th className="p-4">Date Enrolled</th>
                <th className="p-4">Student ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Address</th>
                <th className="p-4">Parent/Guardian Name</th>
                <th className="p-4">Parent/Guardian Phone Number</th>
                <th className="p-4">Course Enrolled</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="text-[13px] ">
              {paginatedData.map((student, index) => (
                <tr key={student.id} className="border-t border-gray-200">
                  <td className="p-4 flex items-center align-middle">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleCheckboxChange(student.id)}
                      className="mr-2 accent-primary"
                    />
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="p-3">{student.dateEnrolled}</td>
                  <td className="p-3">{student.studentId}</td>
                  <td className="p-3 font-bold">{student.fullName}</td>
                  <td className="p-3">{student.email}</td>
                  <td className="p-3">{student.phone}</td>
                  <td className="p-3">{student.address}</td>
                  <td className="p-3">{student.parentGuardianName}</td>
                  <td className="p-3">{student.parentGuardianPhone}</td>
                  <td className="p-3">{student.courseEnrolled}</td>
                  <td className="p-3 relative text-right">
                    <button
                      onClick={() => toggleDropdown(student.id)}
                      className="flex items-center justify-between px-3 py-2 text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Action
                      <ChevronDown size={16} className="ml-2" />
                    </button>
                    {openDropdown === student.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        <button
                          onClick={() => handleView(student.id)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(student.id)}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="sticky bottom-0 z-10 bg-white">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
