"use client";
import LeadModal from "@/components/modals/academic/Lead.modal";
import EnrollStudentModal from "@/components/modals/academic/StudentModal";
import EntityDeleteModal from "@/components/modals/academic/EntityDeleteModal";
import NotFoundComponent from "@/components/NotFoundComponent";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useEntityDelete } from "@/hooks/useEntityDelete";
import { createLead } from "@/lib/network";
import { createStudentClient } from "@/lib/client-network";
import { formatDate } from "@/lib/utils";
import { showError, showSuccess } from "@/lib/toast";
import { Center } from "@/types/academic/center.interface";
import { Course } from "@/types/academic/course.interface";
import { Lead } from "@/types/academic/lead.interface";
import { CreateLead } from "@/types/requests/lead.interface";
import { CreateStudent, UpdateStudent } from "@/types/requests/student.interface";
import { ChevronDown, Link2Icon, Eye, Trash2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Pagination from "../common/Pagination";
import StatusBadge from "../common/StatusBadge";

type Props = {
  leads: Lead[];
  centers: Center[];
  courses: Course[];
  searchQuery: string;
  filterOptions: {
    startDate: string;
    endDate: string;
  };
};

export default function LeadTable({
  leads,
  centers,
  courses,
  searchQuery,
  filterOptions,
}: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
  
  // Use reusable delete hook
  const { handleHardDelete: handleHardDeleteEntity } = useEntityDelete({
    entityType: "leads",
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // All leads are active (no soft delete filtering)
  // Use leads prop directly (which comes from React Query cache)
  const activeLeads = useMemo(() => {
    return leads;
  }, [leads]);

  const [filteredData, setFilteredData] = useState(activeLeads);
  const itemsPerPage = 10;

  useEffect(() => {
    let result = activeLeads;
    const { startDate, endDate } = filterOptions;
    const query = searchQuery.toLowerCase();

    // Filter by search query
    const filtered = result.filter((lead) => {
      const matchesSearch =
        lead.code.toLowerCase().includes(query) ||
        lead.fullName.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.phone.toLowerCase().includes(query) ||
        lead.course.name.toLowerCase().includes(query);
      return matchesSearch;
    });

    result = filtered;

    // Filter by date range
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      result = result.filter((lead) => {
        const leadDate = new Date(lead.enquiryDate);

        if (start && end) {
          return leadDate >= start && leadDate <= end;
        } else if (start) {
          return leadDate >= start;
        } else if (end) {
          return leadDate <= end;
        }
        return false;
      });
    }

    // ✅ Sort leads in descending order by enquiryDate
    result = result.sort(
      (a, b) =>
        new Date(b.enquiryDate).getTime() - new Date(a.enquiryDate).getTime()
    );

    setFilteredData(result);
    setCurrentPage(1);
  }, [searchQuery, filterOptions, activeLeads]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const handleSave = async (payload: CreateLead) => {
    try {
      await createLead(payload);
      setIsModalOpen(false);
      // Invalidate React Query cache - parent component will update via React Query
      queryClient.invalidateQueries({ queryKey: ["leads"], refetchType: "active" });
    } catch (error) {
    }
  };

  const handleEnrollSave = (payload: CreateStudent | UpdateStudent) => {
    // In enroll mode, payload is always CreateStudent
    const createPayload = payload as CreateStudent;
    createStudentClient(createPayload)
      .then(() => {
        showSuccess("Student enrolled successfully");
        setIsEnrollModalOpen(false);
        router.push("/dashboard/academic/students");
      })
      .catch((error) => {
        showError("Student enrollment failed");
      });
  };

  const handleHardDelete = async (leadId: string) => {
    try {
      await handleHardDeleteEntity(leadId);
      // Close modal after operation completes and toast is shown
      setIsDeleteModalOpen(false);
      setSelectedLead(null);
    } catch (error) {
      // Error toast is shown by useEntityDelete hook
      // Keep modal open on error so user can retry
    }
  };

  const handleEnroll = (leadId: string) => {
    setOpenDropdown(null);
    setSelectedLeadId(leadId);
    setIsEnrollModalOpen(true);
  };

  const handleDelete = (lead: Lead) => {
    setOpenDropdown(null);
    setSelectedLead(lead);
    setIsDeleteModalOpen(true);
  };

  const handleEmail = (id: string) => {
    setOpenDropdown(null);
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <div className="font-inter text-gray-200">
      <div className="w-full bg-white dark:bg-gray-800 rounded-lg relative overflow-hidden">
        <div className="w-full h-[60vh] custom-scroll overflow-x-auto">
          {filteredData.length === 0 ? (
            <NotFoundComponent text="Lead" setIsModalOpen={setIsModalOpen} />
          ) : (
            <table className="min-w-max relative border-collapse text-[14px] text-gray-700 dark:text-gray-300 overflow-x-auto">
              <thead>
                <tr className="font-inter font-medium text-[13px] text-left text-gray-500 dark:text-gray-300 bg-gray-100 dark:bg-gray-800">
                  <th className="p-4">#</th>
                  <th className="p-4">Inquiry ID</th>
                  <th className="p-4">Full Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Inquiry Date</th>
                  <th className="p-4">Course Inquiry</th>
                  <th className="p-4">Next Follow-up</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody className="text-[13px]">
                {paginatedData.map((lead: Lead, index) => (
                  <tr
                    key={lead.id}
                    className="hover:shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <td className="pt-6">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/dashboard/academic/leads/${lead.id}`}
                        className="font-bold text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1"
                      >
                        {lead.code} <Link2Icon size={12} />
                      </Link>
                    </td>
                    <td className="p-4 font-bold">{lead.fullName}</td>
                    <td className="p-4">{lead.email}</td>
                    <td className="p-4">{lead.phone}</td>
                    <td className="p-4">{formatDate(lead.enquiryDate)}</td>
                    <td className="p-4">{lead.course?.name}</td>
                    <td className="p-4">{formatDate(lead.nextFollowUpDate)}</td>
                    <td className="p-3">
                      <StatusBadge step={lead.status} label={lead.status} />
                    </td>
                    <td className="p-4 relative text-right">
                      <button
                        onClick={() => toggleDropdown(lead.id)}
                        className="flex items-center justify-between px-3 py-2 text-white bg-action-button rounded-md shadow-sm focus:outline-none focus:ring-offset-2"
                      >
                        Action
                        <ChevronDown size={16} className="ml-2" />
                      </button>

                      {openDropdown === lead.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-10">
                          <button
                            onClick={() => handleEnroll(lead.id)}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <UserPlus size={16} />
                            Enroll
                          </button>

                          <button
                            onClick={() =>
                              router.push(
                                `/dashboard/academic/leads/${lead.id}`
                              )
                            }
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <Eye size={16} />
                            View
                          </button>

                          {isAdmin && !isAdminLoading && (
                            <button
                              onClick={() => handleDelete(lead)}
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

        <div className="sticky bottom-0 bg-white dark:bg-gray-800">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>

        <LeadModal
          isOpen={isModalOpen}
          centers={centers}
          courses={courses}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          mode="add"
        />

        <EnrollStudentModal
          isOpen={isEnrollModalOpen}
          onClose={() => setIsEnrollModalOpen(false)}
          onSave={handleEnrollSave}
          courses={courses}
          centers={centers}
          leads={leads}
          initialData={{ leadId: selectedLeadId }}
          mode="enroll"
        />

        {selectedLead && (
          <EntityDeleteModal
            entityType="Lead"
            entity={selectedLead}
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedLead(null);
            }}
            onHardDelete={handleHardDelete}
            hasRelatedData={{
              students: 0, // Could be enhanced to check actual related data
            }}
          />
        )}
      </div>
    </div>
  );
}
