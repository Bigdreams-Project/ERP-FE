import { NoSessionError, server } from "@/lib/server";
import { ICourseFeeAssignment, IEditCourseFeeAssignment } from "@/types/academic/center.interface";
import { CreateUser, UpdateUser } from "@/types/auth/signup.interface";
import { AttendanceRecord } from "@/types/requests/attendance";
import { CreateBatch, UpdateBatch } from "@/types/requests/batch.interface";
import { CreateCenter, UpdateCenter } from "@/types/requests/center.interface";
import { CreateCourse, UpdateCourse } from "@/types/requests/course.interface";
import { CreateLead, UpdateLead } from "@/types/requests/lead.interface";
import {
  CreateStudent,
  CreateStudentPayment,
  UpdateStudent,
} from "@/types/requests/student.interface";
import { getSession } from "./session";

// Users
export const getLoggedInUser = async () => {
  try {
    const api = await server();
    const session = await getSession();
    if (!session) {
      throw new NoSessionError();
    }
    const { id } = session.user;
    const res = await api.get(`/users/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch user logged in user:", err.message);
    return {};
  }
};

export const getUsers = async () => {
  try {
    const api = await server();
    const res = await api.get("/users");
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch users:", err.message);
    return [];
  }
};

export const getUser = async (id: string) => {
  try {
    const api = await server();
    const res = await api.get(`/users/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch user:", err.message);
    return {};
  }
};

export const createUser = async (payload: CreateUser) => {
  try {
    const api = await server();
    const res = await api.post(`/users`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to create user:", err.message);
    return err.message;
  }
};

export const updateUser = async (id: string, payload: UpdateUser) => {
  try {
    const api = await server();
    const res = await api.patch(`/users/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to update user:", err.message);
    return err.message;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const api = await server();
    const res = await api.delete(`/users/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to delete user:", err.message);
    return err.message;
  }
};

// Leads
export const getLeads = async () => {
  try {
    const api = await server();
    const res = await api.get("/leads/active");
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
    const res = await api.post(`/centers`, payload);
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

export const getCourseUnassignedCenters = async (id: string) => {
  try {
    const api = await server();
    const res = await api.get(`/courses/${id}/unassigned-centers`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch unassigned centers:", err.message);
    return [];
  }
};

export const getCourseFee = async (id: string) => {
  try {
    const api = await server();
    const res = await api.get(`/courses/center/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch center course fee:", err.message);
    return [];
  }
};

export const createCourse = async (payload: CreateCourse, isDraft: boolean) => {
  try {
    const api = await server();
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

export const assignCenterFee = async (
  courseId: string,
  payload: ICourseFeeAssignment
) => {
  try {
    const api = await server();
    const res = await api.post(`/courses/${courseId}/assign-center-fee`, {
      centerId: payload.centerId,
      lumpSumFee: payload.lumpSumFee,
      baseFee: payload.baseFee,
      maxInstallments: payload.maxInstallments,
      costPerInstallment: payload.costPerInstallment,
    });
    return res.data;
  } catch (err: any) {
    console.error("Failed to assign center fee:", err.message);
    throw new Error(err.message || "Error assigning center fee");
  }
};

export const updateCenterFee = async (
  assignmentId: string,
  payload: IEditCourseFeeAssignment
) => {
  try {
    const api = await server();
    const res = await api.patch(`/courses/center-fee/${assignmentId}`, {
      centerId: payload.centerId,
      lumpSumFee: payload.lumpSumFee,
      baseFee: payload.baseFee,
      maxInstallments: payload.maxInstallments,
      costPerInstallment: payload.costPerInstallment,
    });
    return res.data;
  } catch (err: any) {
    console.error("Failed to update center fee assignment:", err.message);
    throw new Error(err.message || "Error updating center fee");
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

export const getStudentCourses = async (studentId: string) => {
  try {
    const api = await server();
    const res = await api.get(`/students/${studentId}/courses`);
    return res.data;
  } catch (err: any) {
    console.error(`Failed to fetch courses for student ${studentId}:`, err.message);
    return [];
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

export const enrollStudentCourse = async (payload: CreateStudentPayment) => {
  try {
    const api = await server();
    const res = await api.post(`/students/enroll/course`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to create student payment:", err.message);
    return err.message;
  }
};

export const updateStudentCoursePayment = async (payload: CreateStudentPayment) => {
  try {
    const api = await server();
    const res = await api.post(`/students/add/payment`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to update course payment:", err.message);
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

export const createBatch = async (payload: CreateBatch) => {
  try {
    const api = await server();
    const res = await api.post(`/batches`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to create batch:", err.message);
    return err.message;
  }
};

export const updateBatch = async (id: string, payload: UpdateBatch | any) => {
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

// Banks
export const getBanks = async () => {
  try {
    const api = await server();
    const res = await api.get("/banks");
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch banks:", err.message);
    return [];
  }
};

export const getBank = async (id: string) => {
  try {
    const api = await server();
    const res = await api.get(`/banks/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch bank:", err.message);
    return {};
  }
};

export const getTransaction = async (id: string) => {
  try {
    const api = await server();
    const res = await api.get(`/payment/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch transactions:", err.message);
    return {};
  }
};

export const createBank = async (payload: CreateLead) => {
  try {
    const api = await server();
    const res = await api.post(`/banks`, { ...payload });
    return res.data;
  } catch (err: any) {
    console.error("Failed to create bank:", err.message);
    return err.message;
  }
};

export const updateBank = async (id: string, payload: UpdateLead) => {
  try {
    const api = await server();
    const res = await api.patch(`/banks/${id}`, payload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to update bank:", err.message);
    return err.message;
  }
};

export const deleteBank = async (id: string) => {
  try {
    const api = await server();
    const res = await api.delete(`/banks/${id}`);
    return res.data;
  } catch (err: any) {
    console.error("Failed to delete banks:", err.message);
    return err.message;
  }
};

// Attendance
export const getAttendance = async (
  studentId: string,
  year: number,
  month: number
): Promise<AttendanceRecord[]> => {
  try {
    const api = await server();
    const res = await api.get(`/attendance/student/${studentId}?year=${year}&month=${month}`
    );
    console.log("Attendance Data:", res.data);
    return res.data;
  } catch (err: any) {
    console.error("Failed to get attendance:", err.message);
    return err.message;
  }
};

// Payments
export const getAllPayments = async () => {
  try {
    const api = await server();
    const res = await api.get("/payments");
    return res.data;
  } catch (err: any) {
    console.error("Failed to fetch payments", err.message);
    throw new Error(err.message);
  }
};
