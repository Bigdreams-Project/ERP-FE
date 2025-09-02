import { server } from "@/lib/server";

// Leads
export const fetchLeads = async () => {
  try {
    const api = await server();
    const res = await api.get("/leads");
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch leads:", err.message);
    return [];
  }
};

// Centers
export const fetchCenters = async () => {
  try {
    const api = await server();
    const res = await api.get("/centers");
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch centers:", err.message);
    return [];
  }
};

// Courses
export const fetchCourses = async () => {
  try {
    const api = await server();
    const res = await api.get("/courses");
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch courses:", err.message);
    return [];
  }
};

// Students
export const fetchStudents = async () => {
  try {
    const api = await server();
    const res = await api.get("/students");
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch students:", err.message);
    return [];
  }
};

// Batches
export const fetchBatches = async () => {
  try {
    const api = await server();
    const res = await api.get("/batches");
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch batches:", err.message);
    return [];
  }
};
