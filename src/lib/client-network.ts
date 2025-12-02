"use client";
import client from "@/lib/client";
import { ICourseFeeAssignment, IEditCourseFeeAssignment } from "@/types/academic/center.interface";
import { CreateBatch, UpdateBatch } from "@/types/requests/batch.interface";
import { CreateCenter, UpdateCenter } from "@/types/requests/center.interface";
import { CreateCourse, UpdateCourse } from "@/types/requests/course.interface";
import { CreateLead, UpdateLead } from "@/types/requests/lead.interface";
import {
  CreateStudent,
  CreateStudentPayment,
  UpdateStudent,
} from "@/types/requests/student.interface";
import {
  BulkUploadArchiveRequest,
  CreateArchiveRecord,
  UpdateArchiveRecord,
} from "@/types/requests/archive.interface";
import { ArchiveRecord } from "@/types/academic/archive.interface";

// Centers - Client-side functions
export const getCentersClient = async () => {
  try {
    // Use Next.js API route to avoid CORS issues
    const res = await fetch("/api/centers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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

export const createCenterClient = async (payload: CreateCenter, isDraft: boolean) => {
  try {
    // Use Next.js API route to avoid CORS issues
    const res = await fetch("/api/centers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        payload: {
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          address: payload.address,
          status: payload.status,
          type: payload.type,
          managerId: payload.managerId,
          academicHeadId: payload.academicHeadId,
          regionalManagerId: payload.regionalManagerId,
        },
        isDraft,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to create center: ${res.statusText}`);
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

export const softDeleteCenterClient = async (id: string) => {
  try {
    const res = await fetch(`/api/centers/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to soft delete center: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to soft delete center:", err.message);
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
export const getCoursesClient = async () => {
  try {
    // Use Next.js API route to avoid CORS issues
    const res = await fetch("/api/courses", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
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

export const createCourseClient = async (payload: CreateCourse, isDraft: boolean) => {
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
        },
        isDraft,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to create course: ${res.statusText}`);
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

export const updateCourseClient = async (id: string, payload: UpdateCourse) => {
  try {
    const res = await client.patch(`/courses/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to update course:", err.message);
    throw err;
  }
};

// Leads - Client-side functions
export const getLeadsClient = async () => {
  try {
    const res = await fetch("/api/leads/active", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch leads: ${res.statusText}`);
    }

    const data = await res.json();
    const leads = Array.isArray(data) ? data : [];
    return leads;
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

export const createLeadClient = async (payload: CreateLead) => {
  try {
    const res = await client.post("/leads", payload);
    return res.data;
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
    const res = await client.delete(`/leads/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to delete lead:", err.message);
    throw err;
  }
};

// Students - Client-side functions
export const getStudentsClient = async () => {
  try {
    const res = await fetch("/api/students", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch students: ${res.statusText}`);
    }

    const data = await res.json();
    const students = Array.isArray(data) ? data : [];
    return students;
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

export const createStudentClient = async (payload: CreateStudent) => {
  try {
    const res = await client.post("/students", payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to create student:", err.message);
    throw err;
  }
};

export const updateStudentClient = async (id: string, payload: UpdateStudent) => {
  try {
    const res = await client.patch(`/students/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to update student:", err.message);
    throw err;
  }
};

export const deleteStudentClient = async (id: string) => {
  try {
    const res = await client.delete(`/students/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to delete student:", err.message);
    throw err;
  }
};

export const createStudentPaymentClient = async (payload: CreateStudentPayment) => {
  try {
    const res = await client.post("/payment", payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to create student payment:", err.message);
    throw err;
  }
};

// Users - Client-side functions
export const getLoggedInUserClient = async () => {
  try {
    const res = await client.get("/users/me");
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch logged in user:", err.message);
    throw err;
  }
};

// Finance - Client-side functions
export const getFinanceOverviewClient = async () => {
  try {
    const res = await client.get("/payment/overview");
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch finance overview:", err.message);
    return {
      totalRevenue: 0,
      totalPending: 0,
      totalPayments: 0,
      topCenters: [],
      topPendingCenters: [],
    };
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
    const url = `/archive${queryString ? `?${queryString}` : ""}`;

    const res = await client.get(url);
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch archive records:", err.message);
    throw err;
  }
};

export const getArchiveRecordClient = async (id: string) => {
  try {
    const res = await client.get(`/archive/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch archive record:", err.message);
    throw err;
  }
};

export const createArchiveRecordClient = async (payload: CreateArchiveRecord) => {
  try {
    const res = await client.post("/archive", payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to create archive record:", err.message);
    throw err;
  }
};

export const updateArchiveRecordClient = async (
  id: string,
  payload: UpdateArchiveRecord
) => {
  try {
    const res = await client.patch(`/archive/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to update archive record:", err.message);
    throw err;
  }
};

export const deleteArchiveRecordClient = async (id: string) => {
  try {
    const res = await client.delete(`/archive/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to delete archive record:", err.message);
    throw err;
  }
};

export const bulkUploadArchiveClient = async (payload: BulkUploadArchiveRequest) => {
  try {
    const res = await client.post("/archive/bulk-upload", payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to bulk upload archive:", err.message);
    throw err;
  }
};

// Course Fee Assignments - Client-side functions
export const createCourseFeeAssignmentClient = async (
  payload: ICourseFeeAssignment
) => {
  try {
    const res = await client.post("/course-fee-assignment", payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to create course fee assignment:", err.message);
    throw err;
  }
};

export const updateCourseFeeAssignmentClient = async (
  payload: IEditCourseFeeAssignment
) => {
  try {
    const res = await client.patch(`/course-fee-assignment/${payload.id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to update course fee assignment:", err.message);
    throw err;
  }
};

export const deleteCourseFeeAssignmentClient = async (id: string) => {
  try {
    const res = await client.delete(`/course-fee-assignment/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to delete course fee assignment:", err.message);
    throw err;
  }
};

// Batches - Client-side functions
export const getBatchesClient = async () => {
  try {
    const res = await fetch("/api/batches", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch batches: ${res.statusText}`);
    }

    const data = await res.json();
    const batches = Array.isArray(data) ? data : [];
    return batches;
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

export const createBatchClient = async (payload: CreateBatch) => {
  try {
    const res = await client.post("/batches", payload);
    return res.data;
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
    const res = await client.delete(`/batches/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to delete batch:", err.message);
    throw err;
  }
};
