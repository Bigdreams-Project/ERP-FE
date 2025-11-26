"use client";
import CourseModal from "@/components/modals/academic/Course.modal";
import EntityDeleteModal from "@/components/modals/academic/EntityDeleteModal";
import NotFoundComponent from "@/components/NotFoundComponent";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useEntityDelete } from "@/hooks/useEntityDelete";
import { createCourse } from "@/lib/network";
import { Course } from "@/types/academic/course.interface";
import { CreateCourse } from "@/types/requests/course.interface";
import { ChevronDown, Link2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Pagination from "../common/Pagination";
import StatusBadge from "../common/StatusBadge";

type Props = {
  searchQuery: string;
  filteredData: Course[];
};

export default function CoursesTable({ searchQuery, filteredData }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  
  // Use reusable delete hook
  const { handleHardDelete: handleHardDeleteEntity } = useEntityDelete({
    entityType: "courses",
  });
  
  const [selectedCourses, setSelectedCourses] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const itemsPerPage = 10;

  // Use filteredData directly from props (which comes from React Query cache)
  // All courses are active (no soft delete filtering)
  const activeCourses = useMemo(() => {
    return filteredData;
  }, [filteredData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const sortedData = [...activeCourses].sort(
    (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const handleEnroll = (courseId: string) => {
    setOpenDropdown(null);
  };

  const handleView = (courseId: string) => {
    setOpenDropdown(null);
  };

  const handleEdit = (courseId: string) => {
    setOpenDropdown(null);
    setMode("edit");
    setIsModalOpen(true);
  };

  const handleDelete = (course: Course) => {
    setOpenDropdown(null);
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedCourses((prev: any) =>
      prev.includes(id) ? prev.filter((cid: any) => cid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedData.map((course) => course.id);
    const allSelected = currentPageIds.every((id) =>
      selectedCourses.includes(id)
    );
    if (allSelected) {
      setSelectedCourses((prev: any) =>
        prev.filter((id: string) => !currentPageIds.includes(id))
      );
    } else {
      setSelectedCourses((prev: any) => [
        ...prev,
        ...currentPageIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="text-blue-500">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleSave = async (payload: CreateCourse, isDraft: boolean) => {
    try {
      await createCourse(payload, isDraft);
      setIsModalOpen(false);
      // Invalidate React Query cache - parent component will update via React Query
      queryClient.invalidateQueries({ queryKey: ["courses"], refetchType: "active" });
    } catch (error) {
      console.error("Failed to save course:", error);
    }
  };

  const handleHardDelete = async (courseId: string) => {
    try {
      await handleHardDeleteEntity(courseId);
      // Close modal after operation completes and toast is shown
      setIsDeleteModalOpen(false);
      setSelectedCourse(null);
    } catch (error) {
      // Error toast is shown by useEntityDelete hook
      // Keep modal open on error so user can retry
    }
  };

  return (
    <div className="font-inter text-gray-200">
      <div className="w-full bg-white rounded-lg relative overflow-hidden">
        <div className="w-full h-[60vh] custom-scroll overflow-x-auto">
          {filteredData.length === 0 ? (
            <NotFoundComponent text="Courses" setIsModalOpen={setIsModalOpen} />
          ) : (
            <table className="min-w-full relative border-collapse text-[14px] text-gray-700 overflow-x-auto">
              <thead>
                <tr className="font-inter font-medium text-[13px] text-left text-gray-500 bg-gray-100">
                  <th className="p-4 flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        paginatedData.length > 0 &&
                        paginatedData.every((course) =>
                          selectedCourses.includes(course.id!)
                        )
                      }
                      onChange={handleSelectAll}
                      className="mr-2 accent-primary"
                    />{" "}
                    #
                  </th>
                  <th className="p-4">Code</th>
                  <th className="p-4">Title</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Enrolled Students</th>
                  <th className="p-4">Leads</th>
                  <th className="p-4">Course Type</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {paginatedData.map((course, index) => (
                  <tr
                    key={course.id}
                    className="hover:shadow-sm hover:bg-gray-100 cursor-pointer"
                  >
                    <td className="p-4 flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(course.id!)}
                        onChange={() => handleCheckboxChange(course.id!)}
                        className="mr-2 accent-primary"
                      />
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/dashboard/academic/courses/${course.id!}`}
                        className="font-bold text-blue-700 hover:underline flex items-center gap-1"
                      >
                        {highlightMatch(course.code, searchQuery)}
                        <Link2Icon size={12} />
                      </Link>
                    </td>
                    <td className="p-4 font-bold ">
                      {highlightMatch(course.name, searchQuery)}
                    </td>
                    <td className="p-4">{course.duration}</td>
                    <td className="p-4">{course.baseFee}</td>
                    <td className="p-4">
                      {course.students ? course.students?.length : ""}
                    </td>
                    <td className="p-4">{course.leads ? course.leads?.length : ""}</td>
                    <td className="p-4">{course.type}</td>
                    <td className="p-3">
                      <StatusBadge step={course.status} label={course.status} />
                    </td>
                    <td className="p-4 relative text-right">
                      <button
                        onClick={() => toggleDropdown(course.id!)}
                        className="flex items-center justify-between px-3 py-2 text-white bg-action-button rounded-md shadow-sm focus:outline-none focus:ring-offset-2"
                      >
                        Action
                        <ChevronDown size={16} className="ml-2" />
                      </button>
                      {openDropdown === course.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          {/* <button
                            onClick={() => handleEnroll(course.id!)}
                            className="flex items-center w-full px-4 py-2 text-sm text-green-500 hover:bg-gray-100"
                          >
                            Enroll
                          </button> */}
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/academic/courses/${course.id!}`
                              )
                            }
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            View
                          </button>
                          {isAdmin && !isAdminLoading && (
                            <button
                              onClick={() => handleDelete(course)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                              Delete
                            </button>
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

        <div className="sticky bottom-0 z-10 bg-white">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <CourseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          mode={mode}
        />

        {selectedCourse && selectedCourse.id && (
          <EntityDeleteModal
            entityType="Course"
            entity={{ ...selectedCourse, id: selectedCourse.id }}
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedCourse(null);
            }}
            onHardDelete={handleHardDelete}
            hasRelatedData={{
              students: selectedCourse.students?.length || 0,
              leads: selectedCourse.leads?.length || 0,
            }}
          />
        )}
      </div>
    </div>
  );
}
