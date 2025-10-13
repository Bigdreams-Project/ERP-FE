"use client";
import StudentModal from "@/components/modals/academic/StudentModal";
import NotFoundComponent from "@/components/NotFoundComponent";
import { students } from "@/data/mock/academic.data";
import { createStudent, deleteStudent } from "@/lib/network";
import { formatDate } from "@/lib/utils";
import { Center } from "@/types/academic/center.interface";
import { Course } from "@/types/academic/course.interface";
import { Lead } from "@/types/academic/lead.interface";
import { Student } from "@/types/academic/student.interface";
import { CreateStudent } from "@/types/requests/student.interface";
import { ChevronDown, Link2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Pagination from "../common/Pagination";
import StatusBadge from "../common/StatusBadge";
import Link from "next/link";
import DeleteModal from "@/components/modals/common/Delete.modal";

type Props = {
  searchQuery: string;
  filteredData: Student[];
  courses: Course[];
  centers: Center[];
  leads: Lead[];
};

export default function StudentTable({
  searchQuery,
  filteredData,
  courses,
  centers,
  leads,
}: Props) {
  const router = useRouter();
  const [data, setData] = useState(filteredData);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const itemsPerPage = 10;

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

  const handleSelectAll = () => {
    const currentPageIds = paginatedData.map((center) => center.id);
    const allSelected = currentPageIds.every((id) =>
      selectedStudents.includes(id!)
    );

    if (allSelected) {
      setSelectedStudents((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    } else {
      setSelectedStudents((prev: any) => [
        ...prev,
        ...currentPageIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const handleSave = async (payload: CreateStudent) => {
    try {
      const response = await createStudent(payload);

      console.log("Student created successfully:", response);

      setData((prev) => [...prev, response]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save student:", error);
    }
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

  const handleDelete = (centerId: string) => {
    setOpenDropdown(null);
    setSelectedStudentId(centerId);
    setIsDeleteModalOpen(true);
  };

  const handleEdit = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    if (student) {
      window.location.href = `mailto:${student.email}`;
    }
    setOpenDropdown(null);
    setIsModalOpen(true);
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleDeleteStudent = async (studentId: string) => {
    try {
      await deleteStudent(studentId);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete student:", error);
    }
  };

  return (
    <div className="font-inter text-gray-200">
      <div className="w-full bg-white rounded-lg relative overflow-hidden">
        <div className="w-full h-[60vh] custom-scroll overflow-x-auto">
          {filteredData.length === 0 ? (
            <NotFoundComponent text="Student" setIsModalOpen={setIsModalOpen} />
          ) : (
            <table className="min-w-max relative border-collapse text-[14px] text-gray-700">
              <thead>
                <tr className="font-inter font-medium text-[13px] text-left text-gray-500 bg-gray-100">
                  <th className="p-4 flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        paginatedData.length > 0 &&
                        paginatedData.every((student) =>
                          selectedStudents.includes(student.id!)
                        )
                      }
                      onChange={handleSelectAll}
                      className="mr-2 accent-primary align-middle"
                    />{" "}
                    #
                  </th>
                  <th className="p-4">Student ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Date Enrolled</th>
                  <th className="p-4">Parent/Guardian Name</th>
                  <th className="p-4">Parent/Guardian Phone Number</th>
                  <th className="p-4">Course Enrolled</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[13px] ">
                {paginatedData.map((student: Student, index) => (
                  <tr
                    key={student.id}
                    className="hover:shadow-sm hover:bg-gray-100 cursor-pointer"
                  >
                    <td className="p-4 flex items-center align-middle">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id!)}
                        onChange={() => handleCheckboxChange(student.id!)}
                        className="mr-2 accent-primary"
                      />
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/dashboard/academic/students/${student.id!}`}
                        className="font-bold text-blue-700 hover:underline flex items-center gap-1"
                      >
                        {student.studentId} <Link2Icon size={12} />
                      </Link>
                    </td>
                    <td className="p-3 font-bold">{student.fullName}</td>
                    <td className="p-3">{student.email}</td>
                    <td className="p-3">{student.phone}</td>
                    <td className="p-3">{student.address}</td>
                    <td className="p-3">{formatDate(student.enrolledDate)}</td>
                    <td className="p-3">{student.guardians[0]?.fullname}</td>
                    <td className="p-3">{student.guardians[0]?.phone}</td>
                    <td className="p-3">
                      {student.courses.length > 0
                        ? student.courses[0]?.name
                        : "Not yet enrolled"}
                    </td>
                    <td className="p-3">
                      <StatusBadge
                        step={student.status}
                        label={student.status}
                      />
                    </td>
                    <td className="p-3 relative text-right">
                      <button
                        onClick={() => toggleDropdown(student.id!)}
                        className="flex items-center justify-between px-3 py-2 text-white bg-action-button rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Action
                        <ChevronDown size={16} className="ml-2" />
                      </button>
                      {openDropdown === student.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/academic/students/${student.id!}`
                              )
                            }
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            View
                          </button>
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/academic/students/enrollment/${student.id!}`
                              )
                            }
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Enrollment
                          </button>
                          <button
                            onClick={() => handleEdit(student.id!)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(student.id!)}
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
          )}
        </div>
      </div>

      <div className="sticky w-full bottom-0 z-10 bg-wite">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        courses={courses}
        centers={centers}
        leads={leads}
        mode="enroll"
      />

      <DeleteModal
        title="Student"
        subtitle="Are you sure you want to delete this student?"
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteStudent}
      />
    </div>
  );
}
