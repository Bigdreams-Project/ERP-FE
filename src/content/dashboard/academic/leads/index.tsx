"use client";
import AcademicTabs from "@/components/academic/common/AcademicTabs";
import BreadCrumb from "@/components/academic/common/BreadCrumb";
import FilterPopover from "@/components/academic/popover/Filter.popover";
import LeadTable from "@/components/academic/tables/Leads.table";
import LeadModal from "@/components/modals/academic/Lead.modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCenter } from "@/context/CenterContext";
import { createLeadClient, getLeadsClient } from "@/lib/client-network";
import { showError, showSuccess } from "@/lib/toast";
import { Center } from "@/types/academic/center.interface";
import { Course } from "@/types/academic/course.interface";
import { Lead } from "@/types/academic/lead.interface";
import { CreateLead } from "@/types/requests/lead.interface";
import { useEffect, useState } from "react";
import { BiSearchAlt } from "react-icons/bi";
import { FaPlus } from "react-icons/fa6";
import { IoFilter } from "react-icons/io5";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface LeadContentProps {
  leads: Lead[];
  centers: Center[];
  courses: Course[];
}

const LeadContent = ({
  leads: initialLeads,
  centers,
  courses,
}: LeadContentProps) => {
  const {
    selectedCenter,
    isLoading: isCenterLoading,
    centerContext,
  } = useCenter();
  const queryClient = useQueryClient();

  // Use React Query to fetch and cache leads
  // Backend handles center filtering via X-Center-Id header, so we pass selectedCenter
  const { data: leads = initialLeads } = useQuery({
    queryKey: ["leads", selectedCenter],
    queryFn: () =>
      getLeadsClient(selectedCenter === "all" ? null : selectedCenter),
    initialData: initialLeads,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnMount: true, // Enable refetching when component mounts
  });

  // Refetch leads whenever selectedCenter changes
  // This ensures data is filtered correctly when user selects a different center from dropdown
  useEffect(() => {
    if (!isCenterLoading && selectedCenter) {
      console.log("Refetching leads for selectedCenter:", selectedCenter);
      // Invalidate cache to ensure fresh data, then refetch
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.refetchQueries({ 
        queryKey: ["leads", selectedCenter],
        type: 'active' // Only refetch active queries
      });
    }
  }, [selectedCenter, isCenterLoading, queryClient]);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    startDate: "",
    endDate: "",
  });

  // Backend handles filtering, so we use leads directly
  const filteredLeads = leads;

  useEffect(() => {
    if (!isTyping && searchInput.length > 0) {
      setIsTyping(true);
    }

    const handler = setTimeout(() => {
      if (searchInput.length === 0) {
        setSearchQuery("");
        setError("");
      } else {
        setError("");
        setSearchQuery(searchInput);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Mutation for creating leads
  const { mutate: createLeadMutation, isPending: isCreating } = useMutation({
    mutationFn: async (payload: CreateLead) => {
      // Pass selectedCenter to ensure center context is maintained
      return await createLeadClient(
        payload,
        selectedCenter === "all" ? null : selectedCenter
      );
    },
    onSuccess: async () => {
      showSuccess("Lead created successfully");
      setIsModalOpen(false);
      // Refetch leads immediately to update the list
      await queryClient.refetchQueries({ queryKey: ["leads", selectedCenter] });
    },
    onError: (error: any) => {
      console.error("Failed to save lead:", error);
      showError("Failed to save lead");
    },
  });

  const handleSave = async (payload: any) => {
    // Backend requirements:
    // - Remove: id, status, createdAt, updatedAt, studyType
    // - parentEmail must be valid email or omitted (not empty string)
    // - Don't send empty strings for required fields
    const transformedPayload: any = {
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      address: payload.address,
      birthDate: payload.birthDate,
      parentName: payload.guardianName,
      parentPhone: payload.guardianPhone,
      // Only include parentEmail if it's a valid email, otherwise omit it
      ...(payload.guardianEmail &&
        payload.guardianEmail.trim() !== "" && {
          parentEmail: payload.guardianEmail,
        }),
      courseId: payload.courseId,
      centerId: payload.centerId,
      enquiryDate: payload.enquiryDate,
      source: payload.source,
      // Optional fields - only include if they have values
      ...(payload.nextFollowUpDate &&
        payload.nextFollowUpDate.trim() !== "" && {
          nextFollowUpDate: payload.nextFollowUpDate,
        }),
      ...(payload.lastFollowUpDate &&
        payload.lastFollowUpDate.trim() !== "" && {
          lastFollowUpDate: payload.lastFollowUpDate,
        }),
      ...(payload.assignedTo &&
        payload.assignedTo.trim() !== "" && {
          assignedTo: payload.assignedTo,
        }),
      ...(payload.note &&
        payload.note.trim() !== "" && {
          note: payload.note,
        }),
    };

    // Log the payload for debugging
    console.log(
      "Transformed payload being sent:",
      JSON.stringify(transformedPayload, null, 2)
    );

    createLeadMutation(transformedPayload);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilterOptions(newFilters);
    setIsFilterOpen(false);
  };

  const filterItems = [
    {
      label: "Inquiry Date",
      name: "inquiryDate",
      type: "date",
      placeholder: "Search by date",
    },
  ];

  return (
    <div className="w-full">
      <BreadCrumb paths={[{ name: "Leads" }]} />
      <div className="w-full flex items-center justify-between text-center">
        <div className="flex items-center mt-4">
          <AcademicTabs />
        </div>

        <div className="flex items-center gap-1">
          <div className="w-full flex items-center justify-end gap-7 p-2">
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <div className="flex items-center gap-2 p-2 rounded-md cursor-pointer bg-white hover:bg-gray-100 transition-colors">
                    <IoFilter size={20} />
                    <p className="font-medium text-gray-900">Filter</p>
                  </div>
                </div>
              </PopoverTrigger>

              <PopoverContent className="w-fit h-60 p-0">
                <FilterPopover
                  filterItems={filterItems}
                  initialFilters={filterOptions}
                  onApply={handleFilterChange}
                />
              </PopoverContent>
            </Popover>

            <div className="w-[250px]">
              <div className="flex items-center gap-1 py-1.5 border-2 rounded focus-within:outline-2 focus-within:outline-indigo-500 transition-all duration-100 placeholder:text-[rgba(0,0,0,0.7)]">
                <BiSearchAlt size={18} className="ml-2" />
                <input
                  type="text"
                  placeholder="Search"
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    if (!isTyping) setIsTyping(true);
                  }}
                  className="outline-none"
                />
              </div>
            </div>

            <button
              className="flex items-center justify-between gap-2 px-3 py-2 text-white bg-add-button rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={() => setIsModalOpen(true)}
            >
              <FaPlus className="text-white" size={16} />
              <span className="text-white text-sm">Add Lead</span>
            </button>
          </div>
        </div>
      </div>

      <LeadTable
        leads={filteredLeads}
        centers={centers}
        courses={courses}
        searchQuery={searchQuery}
        filterOptions={filterOptions}
      />
      <LeadModal
        isOpen={isModalOpen}
        centers={centers}
        courses={courses}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        mode="add"
        initialData={
          selectedCenter !== "all" && selectedCenter
            ? { centerId: selectedCenter, note: "" }
            : undefined
        }
      />
    </div>
  );
};

export default LeadContent;
