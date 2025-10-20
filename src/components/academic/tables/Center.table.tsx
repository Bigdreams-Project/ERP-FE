"use client";
import CenterModal from "@/components/modals/academic/Center.modal";
import NotFoundComponent from "@/components/NotFoundComponent";
import { createCenter, deleteCenter } from "@/lib/network";
import { Center, Manager } from "@/types/academic/center.interface";
import { CreateCenter } from "@/types/requests/center.interface";
import { ChevronDown, Link2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Pagination from "../common/Pagination";
import Link from "next/link";
import DeleteModal from "@/components/modals/common/Delete.modal";

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
  const [data, setData] = useState(centers);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCenters, setSelectedCenters] = useState<string[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCenterId, setSelectedCenterId] = useState<string | null>(null);
  const itemsPerPage = 10;

  const filteredData = data
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

  const handleDelete = (centerId: string) => {
    setOpenDropdown(null);
    setSelectedCenterId(centerId);
    setIsDeleteModalOpen(true);
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedCenters((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedData.map((center) => center.id);
    const allSelected = currentPageIds.every((id) =>
      selectedCenters.includes(id)
    );

    if (allSelected) {
      setSelectedCenters((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    } else {
      setSelectedCenters((prev) => [
        ...prev,
        ...currentPageIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const handleSave = async (payload: CreateCenter, isDraft: boolean) => {
    try {
      const response = await createCenter(payload, isDraft);

      console.log("Center created successfully:", response);

      setData((prev) => [...prev, response]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save lead:", error);
    }
  };

  const handleDeleteCenter = async (leadId: string) => {
    try {
      await deleteCenter(leadId);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete lead:", error);
    }
  };

  return (
    <div className="font-inter text-gray-200">
      <div className="w-full bg-white rounded-lg relative overflow-hidden">
        <div className="w-full h-[60vh] custom-scroll overflow-x-auto">
          {filteredData.length === 0 ? (
            <NotFoundComponent text="Center" setIsModalOpen={setIsModalOpen} />
          ) : (
            <table className="min-w-max relative border-collapse text-[14px] text-gray-700">
              <thead>
                <tr className="font-inter font-medium text-[13px] text-left text-gray-500 bg-gray-100">
                  <th className="p-4 flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        paginatedData.length > 0 &&
                        paginatedData.every((center) =>
                          selectedCenters.includes(center.id)
                        )
                      }
                      onChange={handleSelectAll}
                      className="mr-2 accent-primary"
                    />
                    #
                  </th>
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
                    className="hover:shadow-sm hover:bg-gray-100 cursor-pointer"
                  >
                    <td className="p-4 flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCenters.includes(center.id)}
                        onChange={() => handleCheckboxChange(center.id)}
                        className="mr-2 accent-primary"
                      />
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/dashboard/academic/centers/${center.id}`}
                        className="font-bold text-blue-700 hover:underline flex items-center gap-1"
                      >
                        {center.code} <Link2Icon size={12} />
                      </Link>
                    </td>
                    <td className="p-3">
                      {highlightMatch(center.name, searchQuery)}
                    </td>
                    <td className="p-3 font-bold">
                      {highlightMatch(center.manager?.fullname, searchQuery)}
                    </td>
                    <td className="p-3">
                      {highlightMatch(center.email, searchQuery)}
                    </td>
                    <td className="p-3">
                      {highlightMatch(center.phone, searchQuery)}
                    </td>
                    <td className="p-3">
                      {highlightMatch(center.address, searchQuery)}
                    </td>
                    <td className="p-3">{center.students.length}</td>
                    <td className="p-3">{center.leads.length}</td>
                    <td className="p-3">{center.status}</td>
                    <td className="p-3 relative text-right">
                      <button
                        onClick={() => toggleDropdown(center.id)}
                        className="flex items-center justify-between px-3 py-2 text-white bg-action-button rounded-md shadow-sm focus:outline-none focus:ring-offset-2"
                      >
                        Action
                        <ChevronDown size={16} className="ml-2" />
                      </button>
                      {openDropdown === center.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/academic/centers/${center.id}`
                              )
                            }
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(center.id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(center.id)}
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

      <div className="sticky w-full bottom-0 z-10 bg-white">
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

      <DeleteModal
        title="Center"
        subtitle="Are you sure you want to delete this center?"
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteCenter}
      />
    </div>
  );
}
