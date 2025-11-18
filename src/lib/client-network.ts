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
    const res = await client.get("/centers");
    return res.data;
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
    const res = await client.post(`/centers`, payload);
    return res.data;
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
    const res = await client.delete(`/centers/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to delete center:", err.message);
    throw err;
  }
};

// Courses - Client-side functions
export const getCoursesClient = async () => {
  try {
    const res = await client.get("/courses");
    return res.data;
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
    const res = await client.post(`/courses`, {
      name: payload.name,
      type: payload.type as any,
      duration: payload.duration,
      isDraft,
    });
    return res.data;
  } catch (err: any) {
    console.error("Failed to create course:", err.message);
    throw err;
  }
};

// Students - Client-side functions
export const getStudentsClient = async () => {
  try {
    const res = await client.get("/students");
    return res.data;
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
    const res = await client.post(`/students`, payload);
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

// Leads - Client-side functions
export const getLeadsClient = async () => {
  try {
    const res = await client.get("/leads/active");
    return res.data;
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
    const res = await client.post(`/leads`, payload);
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
    const res = await client.get("/batches");
    return res.data;
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
    const res = await client.post(`/batches`, payload);
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
    // Try /users/me endpoint first (common pattern)
    try {
      const res = await client.get("/users/me");
      return res.data;
    } catch (meError: any) {
      // If /users/me doesn't exist, try to decode JWT token to get user ID
      const accessToken = sessionStorage.getItem("accessToken");
      if (accessToken) {
        try {
          // Decode JWT token (simple base64 decode, no verification needed for client-side)
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          if (payload.id || payload.userId || payload.sub) {
            const userId = payload.id || payload.userId || payload.sub;
            const res = await client.get(`/users/${userId}`);
            return res.data;
          }
        } catch (decodeError) {
          console.error("Failed to decode token:", decodeError);
        }
      }
      throw meError;
    }
  } catch (err: any) {
    console.error("Failed to fetch logged in user:", err.message);
    throw err;
  }
};

