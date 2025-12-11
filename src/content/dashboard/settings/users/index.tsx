"use client";
import BreadCrumbSettings from "@/components/academic/common/BreadCrumbSettings";
import UserModal from "@/components/modals/settings/User.modal";
import UsersTable from "@/components/settings/tables/Users.table";
import { createUser, getUsers } from "@/lib/network";
import { showError, showSuccess } from "@/lib/toast";
import { Center } from "@/types/academic/center.interface";
import { User } from "@/types/auth/user.interface";
import { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";

interface UsersContentProps {
  users: User[];
  centers: Center[];
}

const UsersContent = ({ users: initialUsers, centers }: UsersContentProps) => {
  const [data, setData] = useState<User[]>(initialUsers);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(searchInput);
      setIsTyping(false);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const refreshData = async () => {
    try {
      setIsRefreshing(true);
      const response = await getUsers();
      setData(response);
    } catch (error) {
      console.error("Failed to refresh users:", error);
      showError("Failed to load users");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSave = async (payload: any) => {
    try {
      await createUser(payload);
      showSuccess("User created successfully");
      setIsModalOpen(false);

      await refreshData();
    } catch (error) {
      console.error("Failed to save user:", error);
      showError("Failed to create user");
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-row justify-between items-center mb-10">
        <BreadCrumbSettings paths={[{ name: "Users" }]} />

        <div className="w-full flex items-center justify-end p-2 mt-4">
          <div className="flex items-center gap-1 w-[250px]">
            <div className="flex items-center gap-1 py-1.5 border-2 border-gray-300 dark:border-gray-600 rounded focus-within:outline-2 focus-within:outline-indigo-500 dark:focus-within:outline-indigo-400 transition-all duration-100 bg-white dark:bg-gray-800">
              <BiSearchAlt size={18} className="ml-2 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search user"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (!isTyping) setIsTyping(true);
                }}
                className="outline-none w-full bg-transparent text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
            </div>
          </div>

          <button
            className="flex items-center justify-between gap-2 px-3 py-2 text-white bg-add-button rounded-md shadow-sm hover:bg-indigo-700"
            onClick={() => setIsModalOpen(true)}
            disabled={isRefreshing}
          >
            <FaPlus className="text-white" size={16} />
            <span className="text-white text-sm">
              {isRefreshing ? "Refreshing..." : "Add User"}
            </span>
          </button>
        </div>
      </div>

      <UsersTable
        users={data}
        searchQuery={searchQuery}
        onRefresh={refreshData}
      />

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        mode="add"
        centers={centers}
      />
    </div>
  );
};

export default UsersContent;
