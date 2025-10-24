"use client";
import NotFoundComponent from "@/components/NotFoundComponent";
import Pagination from "@/components/academic/common/Pagination";
import StatusBadge from "@/components/academic/common/StatusBadge";
import DeleteModal from "@/components/modals/common/Delete.modal";
import { deleteUser } from "@/lib/network";
import { showError, showSuccess } from "@/lib/toast";
import { User } from "@/types/auth/user.interface";
import { ChevronDown, Link2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UsersTableProps {
  users: User[];
  searchQuery: string;
  onRefresh: () => Promise<void>;
}

export default function UsersTable({
  users,
  searchQuery,
  onRefresh,
}: UsersTableProps) {
  const router = useRouter();

  const [data, setData] = useState<User[]>(() =>
    [...users].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );

  const [filteredData, setFilteredData] = useState<User[]>(data);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const itemsPerPage = 10;

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const result = data.filter(
      (user) =>
        user.firstname?.toLowerCase().includes(query) ||
        user.lastname?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
    );
    setFilteredData(result);
    setCurrentPage(1);
  }, [searchQuery, data]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      showSuccess("User deleted successfully");
      setIsDeleteModalOpen(false);
      await onRefresh();
    } catch (error) {
      console.error("Failed to delete user:", error);
      showError("User not deleted");
    }
  };

  const handleSelectAll = () => {
    const currentPageIds = paginatedData.map((user) => user.id);
    const allSelected = currentPageIds.every((id) =>
      selectedUsers.includes(id)
    );

    if (allSelected) {
      setSelectedUsers((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
    } else {
      setSelectedUsers((prev) => [
        ...prev,
        ...currentPageIds.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const handleDelete = (leadId: string) => {
    setOpenDropdown(null);
    setSelectedUserId(leadId);
    setIsDeleteModalOpen(true);
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <div className="font-inter text-gray-200 mt-6">
      <div className="w-full bg-white rounded-lg relative overflow-hidden">
        <div className="w-full h-[60vh] custom-scroll overflow-x-auto">
          {filteredData.length === 0 ? (
            <NotFoundComponent text="User" setIsModalOpen={setIsModalOpen} />
          ) : (
            <table className="min-w-full border-collapse text-[14px] text-gray-700">
              <thead>
                <tr className="font-medium text-[13px] text-left text-gray-500 bg-gray-100">
                  <th className="p-4 flex items-center">
                    <input
                      type="checkbox"
                      checked={
                        paginatedData.length > 0 &&
                        paginatedData.every((lead) =>
                          selectedUsers.includes(lead.id)
                        )
                      }
                      onChange={handleSelectAll}
                      className="mr-2"
                    />
                    #
                  </th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody className="text-[13px]">
                {paginatedData.map((user, index) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-100 cursor-pointer transition-all"
                  >
                    <td className="p-4 flex items-center">
                      <input type="checkbox" className="mr-2" />
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-4 font-bold">
                      <Link
                        href={`/dashboard/settings/users/${user.id}`}
                        className="font-bold text-blue-700 hover:underline flex items-center gap-1"
                      >
                        {user.firstname} {user.lastname} <Link2Icon size={12} />
                      </Link>
                    </td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4 capitalize">{user.role}</td>
                    <td className="p-4">
                      <StatusBadge step={user.status} label={user.status} />
                    </td>
                    <td className="p-4 relative text-right">
                      <button
                        onClick={() => toggleDropdown(user.id)}
                        className="flex items-center justify-between px-3 py-2 text-white bg-action-button rounded-md shadow-sm focus:outline-none focus:ring-offset-2"
                      >
                        Action
                        <ChevronDown size={16} className="ml-2" />
                      </button>

                      {openDropdown === user.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/settings/users/${user.id}`
                              )
                            }
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            View
                          </button>

                          <button
                            onClick={() => handleDelete(user.id)}
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

        <div className="sticky bottom-0 bg-white">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <DeleteModal
          title="Lead"
          subtitle="Are you sure you want to delete this user?"
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={handleDeleteUser}
        />
      </div>
    </div>
  );
}
