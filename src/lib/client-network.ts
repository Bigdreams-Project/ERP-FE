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
    // Frontend safety filter: exclude soft-deleted centers
    const centers = Array.isArray(data) ? data : [];
    return centers.filter((center: any) => !center.deletedAt);
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
      body: JSON.stringify({ payload, isDraft }),
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

export const softDeleteCenterClient = async (id: string) => {
  try {
    const res = await fetch(`/api/centers/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ deletedAt: new Date().toISOString() }),
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
    // Frontend safety filter: exclude soft-deleted courses
    const courses = Array.isArray(data) ? data : [];
    return courses.filter((course: any) => !course.deletedAt);
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

export const softDeleteCourseClient = async (id: string) => {
  try {
    const res = await fetch(`/api/courses/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ deletedAt: new Date().toISOString() }),
    });

    if (!res.ok) {
      throw new Error(`Failed to soft delete course: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to soft delete course:", err.message);
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

// Students - Client-side functions
export const getStudentsClient = async () => {
  try {
    // Use Next.js API route to avoid CORS issues
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
    // Frontend safety filter: exclude soft-deleted students
    const students = Array.isArray(data) ? data : [];
    return students.filter((student: any) => !student.deletedAt);
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
    // Use Next.js API route to avoid CORS issues
    const res = await fetch(`/api/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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

export const updateStudentClient = async (id: string, payload: UpdateStudent) => {
  try {
    const res = await client.patch(`/students/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to update student:", err.message);
    throw err;
  }
};

export const softDeleteStudentClient = async (id: string) => {
  try {
    const res = await fetch(`/api/students/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ deletedAt: new Date().toISOString() }),
    });

    if (!res.ok) {
      throw new Error(`Failed to soft delete student: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to soft delete student:", err.message);
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

// Leads - Client-side functions
export const getLeadsClient = async () => {
  try {
    // Use Next.js API route to avoid CORS issues
    const res = await fetch("/api/leads", {
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

export const createLeadClient = async (payload: CreateLead) => {
  try {
    // Use Next.js API route to avoid CORS issues
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to create lead: ${res.statusText}`);
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

export const softDeleteLeadClient = async (id: string) => {
  try {
    const res = await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ deletedAt: new Date().toISOString() }),
    });

    if (!res.ok) {
      throw new Error(`Failed to soft delete lead: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to soft delete lead:", err.message);
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
export const getBatchesClient = async () => {
  try {
    // Use Next.js API route to avoid CORS issues
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

export const createBatchClient = async (payload: CreateBatch) => {
  try {
    // Remove status before sending (backend validation requirements)
    // centerId is required, so we always include it
    const { status, ...rest } = payload;
    const cleanPayload = {
      ...rest,
    };

    // Use Next.js API route to avoid CORS issues
    const res = await fetch("/api/batches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(cleanPayload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || `Failed to create batch: ${res.statusText}`);
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

export const softDeleteBatchClient = async (id: string) => {
  try {
    const res = await fetch(`/api/batches/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ deletedAt: new Date().toISOString() }),
    });

    if (!res.ok) {
      throw new Error(`Failed to soft delete batch: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (err: any) {
    console.error("Failed to soft delete batch:", err.message);
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

// Banks - Client-side functions
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

