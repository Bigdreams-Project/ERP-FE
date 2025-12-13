"use client";
import StudentModal from "@/components/modals/academic/StudentModal";
import StudentDeleteModal from "@/components/modals/academic/StudentDeleteModal";
import ArchiveStudentConfirmModal from "@/components/modals/academic/ArchiveStudentConfirm.modal";
import NotFoundComponent from "@/components/NotFoundComponent";
// Removed unused mock data import to speed up compilation
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useEntityDelete } from "@/hooks/useEntityDelete";
import { createStudentClient, archiveStudentToArchiveClient, enrollStudentToProgramClient } from "@/lib/client-network";
import { showError, showSuccess } from "@/lib/toast";
import { formatDate } from "@/lib/utils";
import { programTypeLabels } from "@/data/constants/program.constants";
import { Center } from "@/types/academic/center.interface";
import { Course } from "@/types/academic/course.interface";
import { Lead } from "@/types/academic/lead.interface";
import { Student } from "@/types/academic/student.interface";
import { Bank } from "@/types/finance/bank.interface";
import { CreateStudent, UpdateStudent } from "@/types/requests/student.interface";
import { ChevronDown, Link2Icon, Archive, Eye, Trash2, GraduationCap, Briefcase } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Pagination from "../common/Pagination";
import StatusBadge from "../common/StatusBadge";

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
  leads
}: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  
  // Use reusable delete hook
  const { handleHardDelete: handleHardDeleteEntity } = useEntityDelete({
    entityType: "students",
    onSuccess: (id) => {
      setData((prev) => prev.filter((s) => s.id !== id));
    },
  });
  
  const [data, setData] = useState(filteredData);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const itemsPerPage = 10;

  // All students are active (no soft delete filtering)
  const activeStudents = useMemo(() => {
    return filteredData;
  }, [filteredData]);

  const sortedData = [...activeStudents].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
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


  const handleSave = (payload: CreateStudent | UpdateStudent) => {
    // In enroll mode, payload is always CreateStudent
    const createPayload = payload as CreateStudent;
    createStudentClient(createPayload)
      .then((response) => {
        setData((prev) => [...prev, response]);
        showSuccess("Student enrolled successfully");
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error("Failed to save student:", error);
        showError("Student enrollment failed");
      });
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleEnroll = (studentId: string) => {
    setOpenDropdown(null);
  };

  const handleView = (studentId: string) => {
    setOpenDropdown(null);
  };

  const handleDelete = (student: Student) => {
    setOpenDropdown(null);
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  };

  const handleArchive = (student: Student) => {
    setOpenDropdown(null);
    setSelectedStudent(student);
    setIsArchiveModalOpen(true);
  };

  const handleArchiveConfirm = async (studentId: string) => {
    try {
      await archiveStudentToArchiveClient(studentId);
      showSuccess("Student archived successfully!");
      // Close modal after operation completes and toast is shown
      setIsArchiveModalOpen(false);
      setSelectedStudent(null);
      // Refresh both student list and archive list
      await queryClient.refetchQueries({ queryKey: ["students"] });
      // ✅ Force refetch archive queries immediately (not just invalidate)
      await queryClient.refetchQueries({ queryKey: ["archive"] });
    } catch (error: any) {
      console.error("Failed to archive student:", error);
      showError(error.message || "Failed to archive student");
      // Keep modal open on error so user can retry
    }
  };

  const handleEdit = (studentId: string) => {
    const student = filteredData.find((s) => s.id === studentId);
    if (student) {
      window.location.href = `mailto:${student.email}`;
    }
    setOpenDropdown(null);
    setIsModalOpen(true);
  };


  const handleHardDelete = async (studentId: string) => {
    try {
      await handleHardDeleteEntity(studentId);
      // Close modal after operation completes and toast is shown
      setIsDeleteModalOpen(false);
      setSelectedStudent(null);
    } catch (error) {
      // Error toast is shown by useEntityDelete hook
      // Keep modal open on error so user can retry
    }
  };

  const handleEnrollToProgram = async (studentId: string, programType: "JPTP" | "INTERNSHIP") => {
    try {
      await enrollStudentToProgramClient(studentId, programType);
      showSuccess(`Student enrolled to ${programType} program successfully`);
      setOpenDropdown(null);
      queryClient.invalidateQueries({ queryKey: ["students"] });
    } catch (error: any) {
      console.error("Failed to enroll student to program:", error);
      showError(error.message || "Failed to enroll student to program");
    }
  };

  return (
    <div className="font-inter text-gray-200">
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg relative overflow-hidden">
        <div className="w-full h-[60vh] custom-scroll overflow-x-auto">
          {activeStudents.length === 0 ? (
            <NotFoundComponent text="Student" setIsModalOpen={setIsModalOpen} />
          ) : (
            <table className="min-w-max relative border-collapse text-[14px] text-gray-700 dark:text-gray-300">
              <thead>
                <tr className="font-inter font-medium text-[13px] text-left text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800">
                  <th className="p-4">#</th>
                  <th className="p-4">Student ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Date Enrolled</th>
                  <th className="p-4">Guardian Name</th>
                  <th className="p-4">Guardian Phone Number</th>
                  <th className="p-4">Courses Enrolled</th>
                  <th className="p-4">Center</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[13px] ">
                {paginatedData.map((student: Student, index) => (
                  <tr
                    key={student.id}
                    className="hover:shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <td className="p-4">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/dashboard/academic/students/${student.id!}`}
                        className="font-bold text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        {student.studentId} <Link2Icon size={12} />
                      </Link>
                    </td>
                    <td className="p-3 font-bold">{student.fullName}</td>
                    <td className="p-3">{student.email}</td>
                    <td className="p-3">{student.phone}</td>
                    <td className="p-3">{student.address}</td>
                    <td className="p-3">{formatDate(student.enrolledDate)}</td>
                    <td className="p-3">
                      {student.guardians && student.guardians.length
                        ? student.guardians[0]?.fullname
                        : "N/A"}
                    </td>
                    <td className="p-3">
                      {student.guardians && student.guardians.length
                        ? student.guardians[0]?.phone
                        : "N/A"}
                    </td>
                    <td className="p-3">
                      {student.courses && student.courses.length > 0
                        ? student.courses.length
                        : "Not yet enrolled in a course"}
                    </td>
                    <td className="p-3">
                      {student.center && student.center?.name}
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
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/academic/students/${student.id!}`
                              )
                            }
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Eye size={16} />
                            View
                          </button>
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/academic/students/enrollment/${student.id!}`
                              )
                            }
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <span className="text-base font-semibold">₦</span>
                            View Payments
                          </button>
                          {(student.programType !== "JPTP" && (!student.programType || student.programType === "REGULAR_STUDENT")) && (
                            <button
                              onClick={() => handleEnrollToProgram(student.id!, "JPTP")}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                            >
                              <GraduationCap size={16} />
                              Enroll to JPTP
                            </button>
                          )}
                          {(student.programType !== "INTERNSHIP" && (!student.programType || student.programType === "REGULAR_STUDENT")) && (
                            <button
                              onClick={() => handleEnrollToProgram(student.id!, "INTERNSHIP")}
                              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-purple-600 hover:bg-gray-100"
                            >
                              <Briefcase size={16} />
                              Enroll to Internship
                            </button>
                          )}
                          {isAdmin && !isAdminLoading && (
                            <>
                              <button
                                onClick={() => handleArchive(student)}
                                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-amber-600 hover:bg-gray-100"
                              >
                                <Archive size={16} />
                                Archive
                              </button>
                              <button
                                onClick={() => handleDelete(student)}
                                className="hidden flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </>
                          )}
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

      {selectedStudent && (
        <ArchiveStudentConfirmModal
          student={selectedStudent}
          isOpen={isArchiveModalOpen}
          onClose={() => {
            setIsArchiveModalOpen(false);
            setSelectedStudent(null);
          }}
          onConfirm={handleArchiveConfirm}
        />
      )}

      {selectedStudent && (
        <StudentDeleteModal
          student={selectedStudent}
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedStudent(null);
          }}
          onHardDelete={handleHardDelete}
        />
      )}
    </div>
  );
}
