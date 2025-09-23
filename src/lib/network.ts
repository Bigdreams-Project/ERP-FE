import { NoSessionError, server } from "@/lib/server";
import { CreateBatch } from "@/types/requests/batch.interface";
import { CreateCenter, UpdateCenter } from "@/types/requests/center.interface";
import { CreateCourse, UpdateCourse } from "@/types/requests/course.interface";
import { CreateLead, UpdateLead } from "@/types/requests/lead.interface";
import {
  CreateStudent,
  UpdateStudent,
} from "@/types/requests/student.interface";

// Leads
export const getLeads = async () => {
  try {
    const api = await server();
    const res = await api.get("/leads");
    return res.data;
  } catch (err: any) {
    if (err instanceof NoSessionError) {
      console.error("No active session, please log in.");
    } else {
      console.error("Failed to fetch leads:", err.message);
    }
    return [];
  }
};

export const getLead = async (id: string) => {
  try {
    const api = await server();
    const res = await api.get(`/leads/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch lead:", err.message);
    return {};
  }
};

export const createLead = async (payload: CreateLead) => {
  try {
    const api = await server();
    const res = await api.post(`/leads`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to create lead:", err.message);
    return err.message;
  }
};

export const updateLead = async (id: string, payload: UpdateLead) => {
  try {
    const api = await server();
    const res = await api.patch(`/leads/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to update lead:", err.message);
    return err.message;
  }
};

export const deleteLead = async (id: string) => {
  try {
    const api = await server();
    const res = await api.delete(`/leads/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to delete lead:", err.message);
    return err.message;
  }
};

// Centers
export const getCenters = async () => {
  try {
    const api = await server();
    const res = await api.get("/centers");
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch centers:", err.message);
    return [];
  }
};

export const getCenter = async (id: string) => {
  try {
    const api = await server();
    const res = await api.get(`/centers/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch center:", err.message);
    return {};
  }
};

export const createCenter = async (payload: CreateCenter, isDraft: boolean) => {
  try {
    const api = await server();
    const res = await api.post(`/centers`, { ...payload, isDraft });
    return res.data;
  } catch (err: any) {
    console.error("Failed to create center:", err.message);
    return err.message;
  }
};

export const updateCenter = async (id: string, payload: UpdateCenter) => {
  try {
    const api = await server();
    const res = await api.patch(`/centers/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to update center:", err.message);
    return err.message;
  }
};

export const deleteCenter = async (id: string) => {
  try {
    const api = await server();
    const res = await api.delete(`/centers/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to delete center:", err.message);
    return err.message;
  }
};

// Courses
export const getCourses = async () => {
  try {
    const api = await server();
    const res = await api.get("/courses");
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch courses:", err.message);
    return [];
  }
};

export const getCourse = async (id: string) => {
  try {
    const api = await server();
    const res = await api.get(`/courses/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch course:", err.message);
    return {};
  }
};

export const createCourse = async (payload: CreateCourse, isDraft: boolean) => {
  try {
    const api = await server();
    console.log(`courses`, {
      name: payload.name,
      type: payload.type as any,
      duration: payload.duration,
      isDraft,
    });
    const res = await api.post(`/courses`, {
      name: payload.name,
      type: payload.type as any,
      duration: payload.duration,
      isDraft,
    });
    return res.data;
  } catch (err: any) {
    console.error("Failed to create course:", err.message);
    return err.message;
  }
};

export const updateCourse = async (id: string, payload: UpdateCourse) => {
  try {
    const api = await server();
    const res = await api.patch(`/courses/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to update course:", err.message);
    return err.message;
  }
};

export const deleteCourse = async (id: string) => {
  try {
    const api = await server();
    const res = await api.delete(`/courses/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to delete course:", err.message);
    return err.message;
  }
};

// Students
export const getStudents = async () => {
  try {
    const api = await server();
    const res = await api.get("/students");
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch students:", err.message);
    return [];
  }
};

export const getStudent = async (id: string) => {
  try {
    const api = await server();
    const res = await api.get(`/students/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch students:", err.message);
    return {};
  }
};

export const createStudent = async (payload: CreateStudent) => {
  try {
    const api = await server();
    const res = await api.post(`/students`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to create student:", err.message);
    return err.message;
  }
};

export const updateStudent = async (id: string, payload: UpdateStudent) => {
  try {
    const api = await server();
    const res = await api.patch(`/students/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to update student:", err.message);
    return err.message;
  }
};

export const deleteStudent = async (id: string) => {
  try {
    const api = await server();
    const res = await api.delete(`/students/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to delete student:", err.message);
    return err.message;
  }
};

// Batches
export const getBatches = async () => {
  try {
    const api = await server();
    const res = await api.get("/batches");
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch batches:", err.message);
    return [];
  }
};

export const getBatch = async (id: string) => {
  try {
    const api = await server();
    const res = await api.get(`/batches/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch batch:", err.message);
    return {};
  }
};

export const createBatch = async (id: string, payload: CreateBatch) => {
  try {
    const api = await server();
    const res = await api.post(`/batches`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to create batch:", err.message);
    return err.message;
  }
};

export const updateBatch = async (id: string, payload: UpdateLead) => {
  try {
    const api = await server();
    const res = await api.patch(`/batches/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to update batch", err.message);
    return err.message;
  }
};

export const deleteBatch = async (id: string) => {
  try {
    const api = await server();
    const res = await api.delete(`/batches/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to delete batch:", err.message);
    return err.message;
  }
};

// Managers
export const getManagers = async () => {
  try {
    const api = await server();
    const res = await api.get("/managers");
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch managers:", err.message);
    return [];
  }
};

export const getManager = async (id: string) => {
  try {
    const api = await server();
    const res = await api.get(`/managers/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch manager:", err.message);
    return {};
  }
};

// Faculties
export const getFaculties = async () => {
  try {
    const api = await server();
    const res = await api.get("/faculties");
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch faculties:", err.message);
    return [];
  }
};

export const getFaculty = async (id: string) => {
  try {
    const api = await server();
    const res = await api.get(`/faculties/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch faculty:", err.message);
    return {};
  }
};
