"use client";
import client from "@/lib/client";
import {
  ICourseFeeAssignment,
  IEditCourseFeeAssignment,
} from "@/types/academic/center.interface";
import { CreateBatch, UpdateBatch } from "@/types/requests/batch.interface";
import { CreateCenter, UpdateCenter } from "@/types/requests/center.interface";
import { CreateCourse, UpdateCourse } from "@/types/requests/course.interface";
import { CreateLead, UpdateLead } from "@/types/requests/lead.interface";
import {
  CreateStudent,
  CreateStudentPayment,
  UpdateStudent,
  BulkUploadStudentsRequest,
  BulkUploadStudentsResponse,
} from "@/types/requests/student.interface";
import {
  BulkUploadCoursesRequest,
  BulkUploadCoursesResponse,
} from "@/types/requests/course.interface";
import {
  BulkUploadArchiveRequest,
  CreateArchiveRecord,
  UpdateArchiveRecord,
} from "@/types/requests/archive.interface";
import { ArchiveRecord } from "@/types/academic/archive.interface";

// Centers - Client-side functions
export const getCentersClient = async (centerId?: string | null) => {
  try {
    // Use Next.js API route to avoid CORS issues
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add X-Center-Id header if centerId is provided and not "all"
    if (centerId && centerId !== "all") {
      headers["X-Center-Id"] = centerId;
    }

    const res = await fetch("/api/centers", {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch centers: ${res.statusText}`);
    }

    const data = await res.json();
    // All centers are active (no soft delete filtering)
    const centers = Array.isArray(data) ? data : [];
    return centers;
  } catch (err: any) {
    console.error("Failed to fetch centers:", err.message);
    throw err;
  }
};

export const getCenterClient = async (id: string) => {
  try {
    const res = await client.get(`/centers/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch center:", err.message);
    throw err;
  }
};

export const createCenterClient = async (
  payload: CreateCenter,
  isDraft: boolean
) => {
  try {
    // Use Next.js API route to avoid CORS issues
    const res = await fetch("/api/centers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ payload, isDraft }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to create center: ${res.statusText}`
      );
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to create center:", err.message);
    throw err;
  }
};

export const updateCenterClient = async (id: string, payload: UpdateCenter) => {
  try {
    const res = await client.patch(`/centers/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to update center:", err.message);
    throw err;
  }
};

export const deleteCenterClient = async (id: string) => {
  try {
    const res = await client.patch(`/centers/${id}`, {
      deletedAt: new Date().toISOString(),
    });
    return res.data;
  } catch (err: any) {
    console.error("Failed to delete center:", err.message);
    throw err;
  }
};

export const hardDeleteCenterClient = async (id: string) => {
  try {
    const res = await fetch(`/api/centers/${id}?hard=true`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to hard delete center: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to hard delete center:", err.message);
    throw err;
  }
};

// Courses - Client-side functions
export const getCoursesClient = async (centerId?: string | null) => {
  try {
    // Use Next.js API route to avoid CORS issues
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add X-Center-Id header if centerId is provided and not "all"
    if (centerId && centerId !== "all") {
      headers["X-Center-Id"] = centerId;
    }

    const res = await fetch("/api/courses", {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch courses: ${res.statusText}`);
    }

    const data = await res.json();
    // All courses are active (no soft delete filtering)
    const courses = Array.isArray(data) ? data : [];
    return courses;
  } catch (err: any) {
    console.error("Failed to fetch courses:", err.message);
    throw err;
  }
};

export const getCourseClient = async (id: string) => {
  try {
    const res = await client.get(`/courses/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch course:", err.message);
    throw err;
  }
};

export const createCourseClient = async (
  payload: CreateCourse,
  isDraft: boolean
) => {
  try {
    // Use Next.js API route to avoid CORS issues
    const res = await fetch("/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        payload: {
          name: payload.name,
          type: payload.type,
          duration: payload.duration,
          oldId: payload.oldId,
        },
        isDraft,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to create course: ${res.statusText}`
      );
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to create course:", err.message);
    throw err;
  }
};

export const hardDeleteCourseClient = async (id: string) => {
  try {
    const res = await fetch(`/api/courses/${id}?hard=true`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to hard delete course: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to hard delete course:", err.message);
    throw err;
  }
};

export const bulkUploadCoursesClient = async (
  payload: BulkUploadCoursesRequest
): Promise<BulkUploadCoursesResponse> => {
  try {
    const res = await fetch("/api/courses/bulk-upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to bulk upload courses: ${res.statusText}`
      );
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to bulk upload courses:", err.message);
    throw err;
  }
};

// Students - Client-side functions
export const getStudentsClient = async (centerId?: string | null) => {
  try {
    // Use Next.js API route to avoid CORS issues
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add X-Center-Id header ONLY if centerId is provided and not "all" or null
    // When centerId is null or "all", we don't send the header to get all records
    if (centerId && centerId !== "all" && centerId !== null) {
      headers["X-Center-Id"] = centerId;
      console.log("Fetching students for center:", centerId);
    } else {
      console.log("Fetching ALL students (no center filter)");
    }

    const res = await fetch("/api/students", {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch students: ${res.statusText}`);
    }

    const data = await res.json();
    // Frontend safety filter: exclude soft-deleted students
    const students = Array.isArray(data) ? data : [];
    const filteredStudents = students.filter((student: any) => !student.deletedAt);
    console.log(`getStudentsClient: Received ${students.length} total students, ${filteredStudents.length} after filtering deleted`);
    return filteredStudents;
  } catch (err: any) {
    console.error("Failed to fetch students:", err.message);
    throw err;
  }
};

export const getStudentClient = async (id: string) => {
  try {
    const res = await client.get(`/students/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch student:", err.message);
    throw err;
  }
};

export const createStudentClient = async (
  payload: CreateStudent,
  centerId?: string | null
) => {
  try {
    // Use Next.js API route to avoid CORS issues
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add X-Center-Id header if centerId is provided and not "all"
    if (centerId && centerId !== "all") {
      headers["X-Center-Id"] = centerId;
    }

    const res = await fetch(`/api/students`, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Failed to create student: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to create student:", err.message);
    throw err;
  }
};

export const updateStudentClient = async (
  id: string,
  payload: UpdateStudent
) => {
  try {
    const res = await client.patch(`/students/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to update student:", err.message);
    throw err;
  }
};

/**
 * Restore all soft-deleted students (set deletedAt to null)
 * NOTE: This function should be called once to restore all soft-deleted records
 * After calling this, soft delete functionality is removed - use Archive instead
 */
export const restoreAllSoftDeletedStudentsClient = async () => {
  try {
    const res = await fetch(`/api/students/restore-all`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(
        `Failed to restore soft-deleted students: ${res.statusText}`
      );
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to restore soft-deleted students:", err.message);
    throw err;
  }
};

export const hardDeleteStudentClient = async (id: string) => {
  try {
    const res = await fetch(`/api/students/${id}?hard=true`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to hard delete student: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to hard delete student:", err.message);
    throw err;
  }
};

export const bulkUploadStudentsClient = async (
  payload: BulkUploadStudentsRequest
): Promise<BulkUploadStudentsResponse> => {
  try {
    const res = await fetch("/api/students/bulk-upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to bulk upload students: ${res.statusText}`
      );
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to bulk upload students:", err.message);
    throw err;
  }
};

// Leads - Client-side functions
export const getLeadsClient = async (centerId?: string | null) => {
  try {
    // Use Next.js API route to avoid CORS issues
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add X-Center-Id header if centerId is provided and not "all"
    if (centerId && centerId !== "all") {
      headers["X-Center-Id"] = centerId;
    }

    const res = await fetch("/api/leads", {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = `Failed to fetch leads: ${res.statusText}`;
      
      if (res.status === 403) {
        errorMessage = "Access denied. The backend may be restricting access to this center. Please contact your administrator.";
        console.error("403 Forbidden - Backend denied access. This may be a backend permission issue for ADMIN users accessing specific centers.");
      }
      
      console.error(`getLeadsClient error: ${res.status} ${res.statusText}`, errorText);
      throw new Error(errorMessage);
    }

    const data = await res.json();
    // Frontend safety filter: exclude soft-deleted leads
    const leads = Array.isArray(data) ? data : [];
    return leads.filter((lead: any) => !lead.deletedAt);
  } catch (err: any) {
    console.error("Failed to fetch leads:", err.message);
    throw err;
  }
};

export const getLeadClient = async (id: string) => {
  try {
    const res = await client.get(`/leads/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch lead:", err.message);
    throw err;
  }
};

export const createLeadClient = async (
  payload: CreateLead,
  centerId?: string | null
) => {
  try {
    // Use Next.js API route to avoid CORS issues
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add X-Center-Id header if centerId is provided and not "all"
    if (centerId && centerId !== "all") {
      headers["X-Center-Id"] = centerId;
    }

    const res = await fetch("/api/leads", {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      // Include validation details in error message if available
      const errorMessage =
        errorData.error || `Failed to create lead: ${res.statusText}`;
      const details = errorData.details
        ? ` Details: ${JSON.stringify(errorData.details)}`
        : "";
      throw new Error(errorMessage + details);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to create lead:", err.message);
    throw err;
  }
};

export const updateLeadClient = async (id: string, payload: UpdateLead) => {
  try {
    const res = await client.patch(`/leads/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to update lead:", err.message);
    throw err;
  }
};

export const deleteLeadClient = async (id: string) => {
  try {
    const res = await client.patch(`/leads/${id}`, {
      deletedAt: new Date().toISOString(),
    });
    return res.data;
  } catch (err: any) {
    console.error("Failed to delete lead:", err.message);
    throw err;
  }
};

export const hardDeleteLeadClient = async (id: string) => {
  try {
    const res = await fetch(`/api/leads/${id}?hard=true`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to hard delete lead: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to hard delete lead:", err.message);
    throw err;
  }
};

// Managers - Client-side function
export const getManagersClient = async () => {
  try {
    const res = await client.get("/managers");
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch managers:", err.message);
    throw err;
  }
};

// Batches - Client-side functions
export const getBatchesClient = async (centerId?: string | null) => {
  try {
    // Use Next.js API route to avoid CORS issues
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add X-Center-Id header ONLY if centerId is provided and not "all" or null
    // When centerId is null or "all", we don't send the header to get all records
    if (centerId && centerId !== "all" && centerId !== null) {
      headers["X-Center-Id"] = centerId;
      console.log("Fetching batches for center:", centerId);
    } else {
      console.log("Fetching ALL batches (no center filter)");
    }

    const res = await fetch("/api/batches", {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch batches: ${res.statusText}`);
    }

    const data = await res.json();
    // Frontend safety filter: exclude soft-deleted batches
    const batches = Array.isArray(data) ? data : [];
    return batches.filter((batch: any) => !batch.deletedAt);
  } catch (err: any) {
    console.error("Failed to fetch batches:", err.message);
    throw err;
  }
};

export const getBatchClient = async (id: string) => {
  try {
    const res = await client.get(`/batches/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch batch:", err.message);
    throw err;
  }
};

export const createBatchClient = async (
  payload: CreateBatch,
  centerId?: string | null
) => {
  try {
    // Remove status before sending (backend validation requirements)
    // centerId is required, so we always include it
    const { status, ...rest } = payload;
    const cleanPayload = {
      ...rest,
    };

    // Use Next.js API route to avoid CORS issues
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add X-Center-Id header if centerId is provided and not "all"
    if (centerId && centerId !== "all") {
      headers["X-Center-Id"] = centerId;
    }

    const res = await fetch("/api/batches", {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify(cleanPayload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to create batch: ${res.statusText}`
      );
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to create batch:", err.message);
    throw err;
  }
};

export const updateBatchClient = async (id: string, payload: UpdateBatch) => {
  try {
    const res = await client.patch(`/batches/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to update batch:", err.message);
    throw err;
  }
};

export const deleteBatchClient = async (id: string) => {
  try {
    const res = await client.patch(`/batches/${id}`, {
      deletedAt: new Date().toISOString(),
    });
    return res.data;
  } catch (err: any) {
    console.error("Failed to delete batch:", err.message);
    throw err;
  }
};

export const hardDeleteBatchClient = async (id: string) => {
  try {
    const res = await fetch(`/api/batches/${id}?hard=true`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to hard delete batch: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to hard delete batch:", err.message);
    throw err;
  }
};

// Faculties - Client-side function
export const getFacultiesClient = async () => {
  try {
    const res = await client.get("/faculties");
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch faculties:", err.message);
    throw err;
  }
};

// Users - Client-side function
export const getLoggedInUserClient = async () => {
  try {
    // Use Next.js API route to get user (server-side session)
    const res = await fetch(`/api/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch user: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to fetch logged in user:", err.message);
    throw err;
  }
};

// Center Context - Client-side function
export const getCenterContextClient = async () => {
  try {
    const res = await fetch(`/api/auth/user/center-context`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch center context: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to fetch center context:", err.message);
    throw err;
  }
};

// Banks - Client-side functions
export const getBanksClient = async (centerId?: string | null) => {
  try {
    // Use Next.js API route to avoid CORS issues
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add X-Center-Id header ONLY if centerId is provided and not "all" or null
    // When centerId is null or "all", we don't send the header to get all records
    if (centerId && centerId !== "all" && centerId !== null) {
      headers["X-Center-Id"] = centerId;
      console.log("Fetching banks for center:", centerId);
    } else {
      console.log("Fetching ALL banks (no center filter)");
    }

    const res = await fetch("/api/banks", {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = `Failed to fetch banks: ${res.statusText}`;
      
      if (res.status === 403) {
        errorMessage = "Access denied. The backend may be restricting access to this center. Please contact your administrator.";
        console.error("403 Forbidden - Backend denied access. This may be a backend permission issue for ADMIN users accessing specific centers.");
      }
      
      console.error(`getBanksClient error: ${res.status} ${res.statusText}`, errorText);
      throw new Error(errorMessage);
    }

    const data = await res.json();
    const banks = Array.isArray(data) ? data : [];
    console.log(`getBanksClient: Received ${banks.length} banks`);
    return banks;
  } catch (err: any) {
    console.error("Failed to fetch banks:", err.message);
    throw err;
  }
};

export const getCenterBanksClient = async (centerId: string) => {
  try {
    // Use Next.js API route to avoid CORS issues
    const res = await fetch(`/api/banks/center/${centerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch banks: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to fetch center's banks:", err.message);
    return [];
  }
};

// Finance - Client-side functions
export const getFinanceOverviewClient = async (centerId?: string | null) => {
  try {
    // Use Next.js API route to avoid CORS issues
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add X-Center-Id header ONLY if centerId is provided and not "all" or null
    // When centerId is null or "all", we don't send the header to get all records
    if (centerId && centerId !== "all" && centerId !== null) {
      headers["X-Center-Id"] = centerId;
      console.log("Fetching finance overview for center:", centerId);
    } else {
      console.log("Fetching ALL finance overview (no center filter)");
    }

    const res = await fetch("/api/payment/overview", {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      const errorText = await res.text();
      let errorMessage = `Failed to fetch finance overview: ${res.statusText}`;
      
      if (res.status === 403) {
        errorMessage = "Access denied. The backend may be restricting access to this center. Please contact your administrator.";
        console.error("403 Forbidden - Backend denied access. This may be a backend permission issue for ADMIN users accessing specific centers.");
      }
      
      console.error(`getFinanceOverviewClient error: ${res.status} ${res.statusText}`, errorText);
      throw new Error(errorMessage);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to fetch finance overview:", err.message);
    throw err;
  }
};

// Archive - Client-side functions
export const getArchiveRecordsClient = async (options?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    const params = new URLSearchParams();
    if (options?.page) params.append("page", options.page.toString());
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.search) params.append("search", options.search);

    const queryString = params.toString();
    const url = `/api/archive${queryString ? `?${queryString}` : ""}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch archive records: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to fetch archive records:", err.message);
    throw err;
  }
};

export const getArchiveRecordClient = async (id: string) => {
  try {
    const res = await fetch(`/api/archive/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ error: res.statusText }));
      throw new Error(
        errorData.error || `Failed to fetch archive record: ${res.statusText}`
      );
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to fetch archive record:", err.message);
    throw err;
  }
};

export const createArchiveRecordClient = async (
  payload: CreateArchiveRecord
) => {
  try {
    const res = await fetch("/api/archive", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Failed to create archive record: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to create archive record:", err.message);
    throw err;
  }
};

export const bulkUploadArchiveClient = async (
  payload: BulkUploadArchiveRequest
) => {
  try {
    console.log("=== bulkUploadArchiveClient - Before API Call ===");
    console.log("Uploading archive records:", payload.records.length);
    if (payload.records.length > 0) {
      console.log(
        "First record totalPayment:",
        payload.records[0].totalPayment
      );
      console.log(
        "First record pendingPayment:",
        payload.records[0].pendingPayment
      );
      console.log(
        "First record sample (full):",
        JSON.stringify(payload.records[0], null, 2)
      );
    }
    console.log("================================================");

    const res = await fetch("/api/archive", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ error: res.statusText }));
      const errorMessage =
        errorData.error ||
        `Failed to upload archive records: ${res.statusText}`;
      console.error("Upload error response:", errorData);
      throw new Error(errorMessage);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to upload archive records:", err.message);
    throw err;
  }
};

export const updateArchiveRecordClient = async (
  id: string,
  payload: UpdateArchiveRecord
) => {
  try {
    const res = await fetch(`/api/archive/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Failed to update archive record: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to update archive record:", err.message);
    throw err;
  }
};

export const archiveStudentToArchiveClient = async (studentId: string) => {
  try {
    const res = await fetch(`/api/archive/from-student/${studentId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ error: res.statusText }));
      const errorMessage =
        errorData.error || `Failed to archive student: ${res.statusText}`;
      console.error("Archive error response:", errorData);
      throw new Error(errorMessage);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to archive student:", err.message);
    throw err;
  }
};

export const restoreStudentFromArchiveClient = async (archiveId: string) => {
  try {
    const res = await fetch(`/api/archive/restore/${archiveId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ error: res.statusText }));
      throw new Error(
        errorData.error || `Failed to restore student: ${res.statusText}`
      );
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to restore student:", err.message);
    throw err;
  }
};

export const deleteArchiveRecordClient = async (id: string) => {
  try {
    const res = await fetch(`/api/archive/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to delete archive record: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to delete archive record:", err.message);
    throw err;
  }
};

export const bulkDeleteArchiveRecordsClient = async (ids: string[]) => {
  try {
    // Delete records sequentially to avoid overwhelming the server
    const results = await Promise.allSettled(
      ids.map((id) => deleteArchiveRecordClient(id))
    );

    const successful = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return {
      successful,
      failed,
      total: ids.length,
    };
  } catch (err: any) {
    console.error("Failed to bulk delete archive records:", err.message);
    throw err;
  }
};

// Notifications - Client-side functions
export const getNotificationsClient = async (params?: {
  read?: boolean;
  limit?: number;
  offset?: number;
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.read !== undefined) {
      queryParams.append("read", String(params.read));
    }
    if (params?.limit) {
      queryParams.append("limit", String(params.limit));
    }
    if (params?.offset) {
      queryParams.append("offset", String(params.offset));
    }

    const res = await fetch(`/api/notifications?${queryParams.toString()}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch notifications: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to fetch notifications:", err.message);
    throw err;
  }
};

export const getUnreadCountClient = async (): Promise<number> => {
  try {
    const res = await fetch("/api/notifications/unread-count", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch unread count: ${res.statusText}`);
    }

    const data = await res.json();
    return data.count || 0;
  } catch (err: any) {
    console.error("Failed to fetch unread count:", err.message);
    return 0;
  }
};

export const markNotificationAsReadClient = async (notificationId: string) => {
  try {
    const res = await fetch(`/api/notifications/${notificationId}/read`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to mark notification as read: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to mark notification as read:", err.message);
    throw err;
  }
};

export const markAllNotificationsAsReadClient = async () => {
  try {
    const res = await fetch("/api/notifications/read-all", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to mark all as read: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to mark all as read:", err.message);
    throw err;
  }
};

// Refunds - Client-side functions
import {
  CreateRefundRequest,
  UpdateRefundRequest,
  RefundRequest,
} from "@/types/finance/refund.interface";
import {
  CreateDiscountRequest,
  UpdateDiscountRequest,
  DiscountRequest,
} from "@/types/finance/discount.interface";

export const getRefundsClient = async (centerId?: string | null) => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (centerId && centerId !== "all") {
      headers["X-Center-Id"] = centerId;
    }

    const res = await fetch("/api/refunds", {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch refunds: ${res.statusText}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err: any) {
    console.error("Failed to fetch refunds:", err.message);
    throw err;
  }
};

export const getRefundClient = async (id: string) => {
  try {
    const res = await fetch(`/api/refunds/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch refund: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to fetch refund:", err.message);
    throw err;
  }
};

export const createRefundRequestClient = async (
  payload: CreateRefundRequest,
  centerId?: string | null
) => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (centerId && centerId !== "all") {
      headers["X-Center-Id"] = centerId;
    }

    const res = await fetch("/api/refunds", {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage =
        errorData.error || `Failed to create refund request: ${res.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to create refund request:", err.message);
    throw err;
  }
};

export const approveRefundClient = async (id: string, notes?: string) => {
  try {
    const res = await fetch(`/api/refunds/${id}/approve`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ notes }),
    });

    if (!res.ok) {
      throw new Error(`Failed to approve refund: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to approve refund:", err.message);
    throw err;
  }
};

export const rejectRefundClient = async (
  id: string,
  rejectionReason: string
) => {
  try {
    const res = await fetch(`/api/refunds/${id}/reject`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ rejectionReason }),
    });

    if (!res.ok) {
      throw new Error(`Failed to reject refund: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to reject refund:", err.message);
    throw err;
  }
};

// Discounts - Client-side functions
export const getDiscountsClient = async (centerId?: string | null) => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (centerId && centerId !== "all") {
      headers["X-Center-Id"] = centerId;
    }

    const res = await fetch("/api/discounts", {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch discounts: ${res.statusText}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err: any) {
    console.error("Failed to fetch discounts:", err.message);
    throw err;
  }
};

export const getDiscountClient = async (id: string) => {
  try {
    const res = await fetch(`/api/discounts/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch discount: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to fetch discount:", err.message);
    throw err;
  }
};

export const createDiscountRequestClient = async (
  payload: CreateDiscountRequest,
  centerId?: string | null
) => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (centerId && centerId !== "all") {
      headers["X-Center-Id"] = centerId;
    }

    const res = await fetch("/api/discounts", {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ error: res.statusText }));
      throw new Error(
        errorData.error ||
          `Failed to create discount request: ${res.statusText}`
      );
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to create discount request:", err.message);
    throw err;
  }
};

export const approveDiscountClient = async (id: string, notes?: string) => {
  try {
    const res = await fetch(`/api/discounts/${id}/approve`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ notes }),
    });

    if (!res.ok) {
      throw new Error(`Failed to approve discount: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to approve discount:", err.message);
    throw err;
  }
};

export const rejectDiscountClient = async (
  id: string,
  rejectionReason: string
) => {
  try {
    const res = await fetch(`/api/discounts/${id}/reject`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ rejectionReason }),
    });

    if (!res.ok) {
      throw new Error(`Failed to reject discount: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to reject discount:", err.message);
    throw err;
  }
};

// Support Tickets - Client-side functions
import {
  CreateTicketRequest,
  UpdateTicketRequest,
  Ticket,
  CreateTicketCommentRequest,
} from "@/types/support/ticket.interface";

export const getTicketsClient = async (centerId?: string | null) => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (centerId && centerId !== "all") {
      headers["X-Center-Id"] = centerId;
    }

    const res = await fetch("/api/tickets", {
      method: "GET",
      headers,
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch tickets: ${res.statusText}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err: any) {
    console.error("Failed to fetch tickets:", err.message);
    throw err;
  }
};

export const getTicketClient = async (id: string) => {
  try {
    const res = await fetch(`/api/tickets/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch ticket: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to fetch ticket:", err.message);
    throw err;
  }
};

export const createTicketClient = async (
  payload: CreateTicketRequest,
  centerId?: string | null
) => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (centerId && centerId !== "all") {
      headers["X-Center-Id"] = centerId;
    }

    const res = await fetch("/api/tickets", {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      const errorMessage =
        errorData.error || `Failed to create ticket: ${res.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to create ticket:", err.message);
    throw err;
  }
};

export const updateTicketClient = async (
  id: string,
  payload: UpdateTicketRequest
) => {
  try {
    const res = await fetch(`/api/tickets/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Failed to update ticket: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to update ticket:", err.message);
    throw err;
  }
};

export const addTicketCommentClient = async (
  payload: CreateTicketCommentRequest
) => {
  try {
    const res = await fetch(`/api/tickets/${payload.ticketId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        comment: payload.comment,
        attachments: payload.attachments,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to add comment: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to add comment:", err.message);
    throw err;
  }
};

// File Upload - Client-side functions
export const uploadFileClient = async (
  file: File,
  studentId: string,
  fileType: "payment_receipt" | "profile_image"
) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("studentId", studentId);
    formData.append("fileType", fileType);

    const res = await fetch("/api/files/upload", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Failed to upload file: ${res.statusText}`
      );
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to upload file:", err.message);
    throw err;
  }
};

export const getStudentFilesClient = async (
  studentId: string,
  fileType?: "payment_receipt" | "profile_image"
) => {
  try {
    let url = `/api/files/student/${studentId}`;
    if (fileType) {
      url += `?fileType=${fileType}`;
    }

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch files: ${res.statusText}`);
    }

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err: any) {
    console.error("Failed to fetch files:", err.message);
    throw err;
  }
};

// Approve Transaction
export const approveTransactionClient = async (
  transactionId: string,
  notes?: string
) => {
  try {
    const res = await fetch(`/api/transactions/${transactionId}/approve`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ notes }),
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ error: res.statusText }));
      throw new Error(
        errorData.error || `Failed to approve transaction: ${res.statusText}`
      );
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to approve transaction:", err.message);
    throw err;
  }
};

// Enroll Student to Program (JPTP or Internship)
export const enrollStudentToProgramClient = async (
  studentId: string,
  programType: "JPTP" | "INTERNSHIP"
) => {
  try {
    const res = await fetch(`/api/students/${studentId}/enroll-program`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ programType }),
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ error: res.statusText }));
      throw new Error(
        errorData.error || `Failed to enroll student to program: ${res.statusText}`
      );
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to enroll student to program:", err.message);
    throw err;
  }
};