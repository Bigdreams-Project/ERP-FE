"use client";

import { EditIcon } from "@/components/ui/icons";
import { statuses } from "@/data/view/batch.data";
import { roles } from "@/data/view/user.data";
import { updateUser } from "@/lib/network";
import { showError, showSuccess } from "@/lib/toast";
import { formatDate } from "@/lib/utils";
import { User } from "@/types/auth/user.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UserDetailsProps {
  user: User;
}

const UserDetails = ({ user }: UserDetailsProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<User>(user);

  const { mutate: saveUser, isPending } = useMutation({
    mutationFn: async (updatedUser: User) => {
      return await updateUser(updatedUser.id, updatedUser);
    },
    onSuccess: () => {
      showSuccess("User updated successfully");
      setIsEditing(false);
      queryClient.invalidateQueries(["users"]);
      queryClient.invalidateQueries(["user", user.id]);
    },
    onError: (error: any) => {
      console.error(error);
      showError("Failed to update user");
    },
  });

  const handleEditToggle = () => {
    if (isEditing) {
      saveUser(formData);
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(user);
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 dark:text-gray-400">
        User not found.
      </div>
    );
  }

  return (
    <div className="flex bg-white dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200 min-h-screen">
      <main className="flex-1 p-8 pb-0">
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
                className="lucide lucide-chevron-left text-indigo-600 dark:text-indigo-400"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              <p className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
                Settings &gt; Users &gt; {user.firstname} {user.lastname}
              </p>
            </div>
            <button
              onClick={() => router.push("/dashboard/settings/users")}
              className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 mr-1 text-blue-600 dark:text-blue-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                />
              </svg>
              Back to Users List
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={isPending}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditToggle}
                  disabled={isPending}
                  className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 rounded-lg text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-60"
                >
                  {isPending ? "Saving..." : "Save"}
                </button>
              </>
            ) : (
              <button
                onClick={handleEditToggle}
                className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 rounded-lg text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                <EditIcon />
                Edit
              </button>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 border-b dark:border-gray-700 pb-2">
            USER DETAILS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries({
              "First Name": "firstname",
              "Last Name": "lastname",
              Email: "email",
              Role: "role",
              Status: "status",
              "Created At": "createdAt",
              "Last Updated": "updatedAt",
            }).map(([label, key]) => (
              <div key={key}>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {label}
                </p>

                {/* Editable fields */}
                {isEditing && !["createdAt", "updatedAt"].includes(key) ? (
                  key === "role" ? (
                    <select
                      value={formData.role || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          role: e.target.value as User["role"],
                        })
                      }
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                    >
                      {roles.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  ) : key === "status" ? (
                    <select
                      value={formData.status || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as User["status"],
                        })
                      }
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                    >
                      {statuses.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formData[key as keyof User] as string}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [key]: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                    />
                  )
                ) : (
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {["createdAt", "updatedAt"].includes(key)
                      ? formatDate(formData[key as keyof User] as string)
                      : formData[key as keyof User] || "N/A"}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDetails;
