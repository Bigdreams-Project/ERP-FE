"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BiSearchAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import AcademicTabs from "@/components/academic/common/AcademicTabs";
import BreadCrumb from "@/components/academic/common/BreadCrumb";
import CenterTable from "@/components/academic/tables/Center.table";
import CenterModal from "@/components/modals/academic/Center.modal";
import { createCenterClient, getCentersClient } from "@/lib/client-network";
import { showError, showSuccess } from "@/lib/toast";
import { Center, Manager } from "@/types/academic/center.interface";
import { CreateCenter } from "@/types/requests/center.interface";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCenter } from "@/context/CenterContext";

interface CenterContentProps {
  centers: Center[];
  managers: Manager[];
}

const CenterContent = ({
  centers: initialCenters,
  managers,
}: CenterContentProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { centerContext, isLoading: isCenterLoading } = useCenter();

  // Redirect center managers away from centers page
  useEffect(() => {
    if (!isCenterLoading && centerContext && !centerContext.canSwitch) {
      // User is a center manager, redirect to overview
      router.push("/dashboard/academic/overview");
    }
  }, [centerContext, isCenterLoading, router]);

  // Don't render anything if user is a center manager
  if (!isCenterLoading && centerContext && !centerContext.canSwitch) {
    return null;
  }
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use React Query to fetch and cache centers
  const { data: centers = initialCenters } = useQuery({
    queryKey: ["centers"],
    queryFn: () => getCentersClient(),
    initialData: initialCenters,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnMount: false,
  });

  useEffect(() => {
    if (!isTyping && searchInput.length > 0) setIsTyping(true);

    const handler = setTimeout(() => {
      if (searchInput.trim().length === 0) {
        setSearchQuery("");
        setError("");
      } else if (searchInput.trim().length < 3) {
        setError("Please enter at least 3 characters");
      } else {
        setError("");
        setSearchQuery(searchInput.trim());
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Mutation for creating centers
  const { mutate: createCenterMutation, isPending: isCreating } = useMutation({
    mutationFn: async ({ payload, isDraft }: { payload: CreateCenter; isDraft: boolean }) => {
      return await createCenterClient(payload, isDraft);
    },
    onSuccess: async () => {
      showSuccess("Center created successfully");
      setIsModalOpen(false);
      // Refetch centers immediately to update the list
      await queryClient.refetchQueries({ queryKey: ["centers"] });
    },
    onError: (error: any) => {
      console.error("Failed to create center:", error);
      showError("Failed to create center");
    },
  });

  const handleSave = async (payload: CreateCenter, isDraft: boolean) => {
    createCenterMutation({ payload, isDraft });
  };

  return (
    <div className="w-full">
      <BreadCrumb paths={[{ name: "Centers" }]} />

      <div className="w-full flex items-center justify-between mt-4">
        <div className="flex items-center mt-4">
          <AcademicTabs />
        </div>

        <div className="flex items-center  gap-7 p-2">
          {/* Search Input */}
          <div className="w-[250px]">
            <div className="flex items-center gap-1 py-1.5 border-2 rounded focus-within:border-indigo-500 transition-all duration-150">
              <BiSearchAlt size={18} className="ml-2 text-gray-600" />
              <input
                type="text"
                placeholder="Search centers..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  if (!isTyping) setIsTyping(true);
                }}
                className="outline-none w-full bg-transparent px-2 text-sm"
              />
            </div>
            {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
          </div>

          {/* Add Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-white bg-add-button rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <FaPlus size={16} />
            <span className="text-sm">Add Center</span>
          </button>
        </div>
      </div>

      <CenterTable
        searchQuery={searchQuery}
        centers={centers}
        managers={managers}
      />

      <CenterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        managers={managers}
        mode="add"
      />
    </div>
  );
};

export default CenterContent;
