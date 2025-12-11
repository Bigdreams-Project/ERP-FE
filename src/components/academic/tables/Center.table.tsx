"use client";
import CenterModal from "@/components/modals/academic/Center.modal";
import EntityDeleteModal from "@/components/modals/academic/EntityDeleteModal";
import NotFoundComponent from "@/components/NotFoundComponent";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useEntityDelete } from "@/hooks/useEntityDelete";
import { createCenter } from "@/lib/network";
import { useQueryClient } from "@tanstack/react-query";
import { Center, Manager } from "@/types/academic/center.interface";
import { CreateCenter } from "@/types/requests/center.interface";
import { ChevronDown, Link2Icon, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Pagination from "../common/Pagination";
import Link from "next/link";

type CenterTableProps = {
  centers: Center[];
  managers: Manager[];
  searchQuery: string;
};

export default function CenterTable({
  centers,
  managers,
  searchQuery,
}: CenterTableProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  
  // Use reusable delete hook
  const { handleHardDelete: handleHardDeleteEntity } = useEntityDelete({
    entityType: "centers",
  });
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const itemsPerPage = 10;

  // Use centers prop directly (which comes from React Query cache)
  // All centers are active (no soft delete filtering)
  const activeCenters = useMemo(() => {
    return centers;
  }, [centers]);

  const filteredData = activeCenters
    .filter((center) => {
      const query = searchQuery.toLowerCase();
      return (
        center.name.toLowerCase().includes(query) ||
        center.email.toLowerCase().includes(query) ||
        center.phone.toLowerCase().includes(query) ||
        center.address.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) {
        return 1;
      }
      if (nameA > nameB) {
        return -1;
      }
      return 0;
    });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

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
        <span key={i} className="text-primary dark:text-indigo-400">
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

  const handleEnroll = (centerId: string) => {
    setOpenDropdown(null);
  };

  const handleView = (centerId: string) => {
    setOpenDropdown(null);
  };

  const handleEdit = (centerId: string) => {
    setOpenDropdown(null);
    setMode("edit");
    setIsModalOpen(true);
  };

  const handleDelete = (center: Center) => {
    setOpenDropdown(null);
    setSelectedCenter(center);
    setIsDeleteModalOpen(true);
  };


  const handleSave = async (payload: CreateCenter, isDraft: boolean) => {
    try {
      await createCenter(payload, isDraft);
      setIsModalOpen(false);
      // Invalidate React Query cache - parent component will update via React Query
      queryClient.invalidateQueries({ queryKey: ["centers"], refetchType: "active" });
    } catch (error) {
      console.error("Failed to save center:", error);
    }
  };

  const handleHardDelete = async (centerId: string) => {
    try {
      await handleHardDeleteEntity(centerId);
      // Close modal after operation completes and toast is shown
      setIsDeleteModalOpen(false);
      setSelectedCenter(null);
    } catch (error) {
      // Error toast is shown by useEntityDelete hook
      // Keep modal open on error so user can retry
    }
  };

  return (
    <div className="font-inter text-gray-200">
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg relative overflow-hidden">
        <div className="w-full h-[60vh] custom-scroll overflow-x-auto">
          {filteredData.length === 0 ? (
            <NotFoundComponent text="Center" setIsModalOpen={setIsModalOpen} />
          ) : (
            <table className="min-w-max relative border-collapse text-[14px] text-gray-700 dark:text-gray-300">
              <thead>
                <tr className="font-inter font-medium text-[13px] text-left text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800">
                  <th className="p-4">#</th>
                  <th className="p-4">Center Code</th>
                  <th className="p-4">Center Name</th>
                  <th className="p-4">Center Manager</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Center Address</th>
                  <th className="p-4">Enrolled Students</th>
                  <th className="p-4">Leads</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[13px]">
                {paginatedData.map((center: Center, index) => (
                  <tr
                    key={center.id}
                    className="hover:shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <td className="p-4 text-gray-700 dark:text-gray-300">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/dashboard/academic/centers/${center.id}`}
                        className="font-bold text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        {center.code} <Link2Icon size={12} />
                      </Link>
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {highlightMatch(center.name, searchQuery)}
                    </td>
                    <td className="p-3 font-bold text-gray-700 dark:text-gray-300">
                      {highlightMatch(center.manager?.fullname, searchQuery)}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {highlightMatch(center.email, searchQuery)}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {highlightMatch(center.phone, searchQuery)}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {highlightMatch(center.address, searchQuery)}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {center.students ? center.students.length : ""}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">
                      {center.leads ? center.leads.length : ""}
                    </td>
                    <td className="p-3 text-gray-700 dark:text-gray-300">{center.status}</td>
                    <td className="p-3 relative text-right">
                      <button
                        onClick={() => toggleDropdown(center.id)}
                        className="flex items-center justify-between px-3 py-2 text-white bg-action-button rounded-md shadow-sm focus:outline-none focus:ring-offset-2"
                      >
                        Action
                        <ChevronDown size={16} className="ml-2" />
                      </button>
                      {openDropdown === center.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/academic/centers/${center.id}`
                              )
                            }
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Eye size={16} />
                            View
                          </button>
                          {isAdmin && !isAdminLoading && (
                            <button
                              onClick={() => handleDelete(center)}
                              className="hidden flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <Trash2 size={16} />
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
      </div>

      <div className="sticky w-full bottom-0 z-10 bg-white dark:bg-gray-800">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <CenterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        managers={managers}
        mode={mode}
      />

      {selectedCenter && (
        <EntityDeleteModal
          entityType="Center"
          entity={selectedCenter}
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedCenter(null);
          }}
          onHardDelete={handleHardDelete}
        />
      )}
    </div>
  );
}
