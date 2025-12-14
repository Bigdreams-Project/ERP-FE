import { NoSessionError, server } from "@/lib/server";
import {
  ICourseFeeAssignment,
  IEditCourseFeeAssignment,
} from "@/types/academic/center.interface";
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
import {
  BulkUploadArchiveRequest,
  CreateArchiveRecord,
  UpdateArchiveRecord,
} from "@/types/requests/archive.interface";
import { ArchiveRecord } from "@/types/academic/archive.interface";
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
    return {};
  }
};

export const getUsers = async () => {
  try {
    const api = await server();
    const res = await api.get("/users");
    return res.data;
  } catch (err: any) {
    return [];
  }
};

export const getUser = async (id: string) => {
  try {
    const api = await server();
    const res = await api.get(`/users/${id}`);
    return res.data;
  } catch (err: any) {
    return {};
  }
};

export const createUser = async (payload: CreateUser) => {
  try {
    const api = await server();
    const res = await api.post(`/users`, payload);
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

export const updateUser = async (id: string, payload: UpdateUser) => {
  try {
    const api = await server();
    const res = await api.patch(`/users/${id}`, payload);
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const api = await server();
    const res = await api.delete(`/users/${id}`);
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

// Leads
export const getLeads = async () => {
  try {
    const api = await server();
    const res = await api.get("/leads/active");
    // Frontend safety filter: exclude soft-deleted leads
    const leads = Array.isArray(res.data) ? res.data : [];
    return leads.filter((lead: any) => !lead.deletedAt);
  } catch (err: any) {
    if (err instanceof NoSessionError) {
    } else {
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
    return {};
  }
};

export const createLead = async (payload: CreateLead) => {
  try {
    const api = await server();
    const res = await api.post(`/leads`, payload);
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

export const updateLead = async (id: string, payload: UpdateLead) => {
  try {
    const api = await server();
    const res = await api.patch(`/leads/${id}`, payload);
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

export const deleteLead = async (id: string) => {
  try {
    const api = await server();
    // Soft delete: PATCH with deletedAt timestamp
    const res = await api.patch(`/leads/${id}`, {
      deletedAt: new Date().toISOString(),
    });
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

export const softDeleteLead = async (id: string) => {
  try {
    const api = await server();
    const res = await api.patch(`/leads/${id}`, {
      deletedAt: new Date().toISOString(),
    });
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

export const hardDeleteLead = async (id: string) => {
  try {
    const api = await server();
    const res = await api.delete(`/leads/${id}?hard=true`);
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

// Centers
export const getCenters = async () => {
  try {
    const api = await server();
    const res = await api.get("/centers");
    // Frontend safety filter: exclude soft-deleted centers
    const centers = Array.isArray(res.data) ? res.data : [];
    return centers.filter((center: any) => !center.deletedAt);
  } catch (err: any) {
    return [];
  }
};

export const getCenter = async (id: string) => {
  try {
    const api = await server();
    const res = await api.get(`/centers/${id}`);
    return res.data;
  } catch (err: any) {
    return {};
  }
};

export const createCenter = async (payload: CreateCenter, isDraft: boolean) => {
  try {
    const api = await server();
    const res = await api.post(`/centers`, payload);
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

export const updateCenter = async (id: string, payload: UpdateCenter) => {
  try {
    const api = await server();
    const res = await api.patch(`/centers/${id}`, payload);
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

export const deleteCenter = async (id: string) => {
  try {
    const api = await server();
    // Soft delete: PATCH with deletedAt timestamp
    const res = await api.patch(`/centers/${id}`, {
      deletedAt: new Date().toISOString(),
    });
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

export const softDeleteCenter = async (id: string) => {
  try {
    const api = await server();
    const res = await api.patch(`/centers/${id}`, {
      deletedAt: new Date().toISOString(),
    });
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

export const hardDeleteCenter = async (id: string) => {
  try {
    const api = await server();
    const res = await api.delete(`/centers/${id}?hard=true`);
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

// Courses
export const getCourses = async () => {
  try {
    const api = await server();
    const res = await api.get("/courses");
    // Frontend safety filter: exclude soft-deleted courses
    const courses = Array.isArray(res.data) ? res.data : [];
    return courses.filter((course: any) => !course.deletedAt);
  } catch (err: any) {
    return [];
  }
};

export const getCourse = async (id: string) => {
  try {
    const api = await server();
    const res = await api.get(`/courses/${id}`);
    return res.data;
  } catch (err: any) {
    return {};
  }
};

export const getCourseUnassignedCenters = async (id: string) => {
  try {
    const api = await server();
    const res = await api.get(`/courses/${id}/unassigned-centers`);
    return res.data;
  } catch (err: any) {
    return [];
  }
};

export const getCourseFee = async (id: string) => {
  try {
    const api = await server();
    const res = await api.get(`/courses/center/${id}`);
    return res.data;
  } catch (err: any) {
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
      oldId: payload.oldId,
      isDraft,
    });
    return res.data;
  } catch (err: any) {
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
      oldCourseFee: payload.oldCourseFee,
    });
    return res.data;
  } catch (err: any) {
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
      oldCourseFee: payload.oldCourseFee,
    });
    return res.data;
  } catch (err: any) {
    throw new Error(err.message || "Error updating center fee");
  }
};

export const updateCourse = async (id: string, payload: UpdateCourse) => {
  try {
    const api = await server();
    const res = await api.patch(`/courses/${id}`, payload);
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

export const deleteCourse = async (id: string) => {
  try {
    const api = await server();
    // Soft delete: PATCH with deletedAt timestamp
    const res = await api.patch(`/courses/${id}`, {
      deletedAt: new Date().toISOString(),
    });
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

export const softDeleteCourse = async (id: string) => {
  try {
    const api = await server();
    const res = await api.patch(`/courses/${id}`, {
      deletedAt: new Date().toISOString(),
    });
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

export const hardDeleteCourse = async (id: string) => {
  try {
    const api = await server();
    const res = await api.delete(`/courses/${id}?hard=true`);
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

// Students
export const getStudents = async () => {
  try {
    const api = await server();
    const res = await api.get("/students");
    // Frontend safety filter: exclude soft-deleted students
    // Backend should handle this, but add as fallback
    const students = Array.isArray(res.data) ? res.data : [];
    return students.filter((student: any) => !student.deletedAt);
  } catch (err: any) {
    return [];
  }
};

export const getStudent = async (id: string) => {
  try {
    const api = await server();
    const res = await api.get(`/students/${id}`);
    return res.data;
  } catch (err: any) {
    throw err; // Re-throw to let the page handle the error
  }
};

export const getStudentCourses = async (studentId: string) => {
  try {
    const api = await server();
    const res = await api.get(`/students/${studentId}/courses`);
    return res.data;
  } catch (err: any) {
    return [];
  }
};

export const createStudent = async (payload: CreateStudent) => {
  try {
    const api = await server();
    const res = await api.post(`/students`, payload);
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

export const enrollStudentCourse = async (payload: CreateStudentPayment) => {
  try {
    const api = await server();
    const res = await api.post(`/students/enroll/course`, payload);
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

export const updateStudentCoursePayment = async (
  payload: CreateStudentPayment
) => {
  try {
    const api = await server();
    const res = await api.post(`/students/add/payment`, payload);
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

export const updateStudent = async (id: string, payload: UpdateStudent) => {
  try {
    const api = await server();
    const res = await api.patch(`/students/${id}`, payload);
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

export const deleteStudent = async (id: string) => {
  try {
    const api = await server();
    // Soft delete: PATCH with deletedAt timestamp
    const res = await api.patch(`/students/${id}`, {
      deletedAt: new Date().toISOString(),
    });
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

export const softDeleteStudent = async (id: string) => {
  try {
    const api = await server();
    const res = await api.patch(`/students/${id}`, {
      deletedAt: new Date().toISOString(),
    });
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

export const hardDeleteStudent = async (id: string) => {
  try {
    const api = await server();
    const res = await api.delete(`/students/${id}?hard=true`);
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

// Batches
export const getBatches = async () => {
  try {
    const api = await server();
    const res = await api.get("/batches");
    // Frontend safety filter: exclude soft-deleted batches
    const batches = Array.isArray(res.data) ? res.data : [];
    return batches.filter((batch: any) => !batch.deletedAt);
  } catch (err: any) {
    return [];
  }
};

export const getBatch = async (id: string) => {
  try {
    const api = await server();
    const res = await api.get(`/batches/${id}`);
    return res.data;
  } catch (err: any) {
    return {};
  }
};

export const createBatch = async (payload: CreateBatch) => {
  try {
    const api = await server();
    const res = await api.post(`/batches`, payload);
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

export const updateBatch = async (id: string, payload: UpdateBatch | any) => {
  try {
    const api = await server();
    const res = await api.patch(`/batches/${id}`, payload);
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

export const deleteBatch = async (id: string) => {
  try {
    const api = await server();
    // Soft delete: PATCH with deletedAt timestamp
    const res = await api.patch(`/batches/${id}`, {
      deletedAt: new Date().toISOString(),
    });
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

export const softDeleteBatch = async (id: string) => {
  try {
    const api = await server();
    const res = await api.patch(`/batches/${id}`, {
      deletedAt: new Date().toISOString(),
    });
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

export const hardDeleteBatch = async (id: string) => {
  try {
    const api = await server();
    const res = await api.delete(`/batches/${id}?hard=true`);
    return res.data;
  } catch (err: any) {
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
    return [];
  }
};

export const getManager = async (id: string) => {
  try {
    const api = await server();
    const res = await api.get(`/managers/${id}`);
    return res.data;
  } catch (err: any) {
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
    return [];
  }
};

export const getFaculty = async (id: string) => {
  try {
    const api = await server();
    const res = await api.get(`/faculties/${id}`);
    return res.data;
  } catch (err: any) {
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
    return [];
  }
};

export const getCenterBanks = async (centerId: string) => {
  try {
    const api = await server();
    const res = await api.get(`/banks/center/${centerId}`);
    return res.data;
  } catch (err: any) {
    return [];
  }
};

export const getBank = async (id: string) => {
  try {
    const api = await server();
    const res = await api.get(`/banks/${id}`);
    return res.data;
  } catch (err: any) {
    return {};
  }
};

export const getTransaction = async (id: string) => {
  try {
    const api = await server();
    // Try /payments/:id first, fallback to /payment/:id
    try {
      const res = await api.get(`/payments/${id}`);
      return res.data;
    } catch (err: any) {
      // Fallback to /payment/:id if /payments/:id doesn't exist
      const res = await api.get(`/payment/${id}`);
      return res.data;
    }
  } catch (err: any) {
    return null;
  }
};

export const createBank = async (payload: CreateLead) => {
  try {
    const api = await server();
    const res = await api.post(`/banks`, { ...payload });
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

export const updateBank = async (id: string, payload: UpdateLead) => {
  try {
    const api = await server();
    const res = await api.patch(`/banks/${id}`, payload);
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

export const deleteBank = async (id: string) => {
  try {
    const api = await server();
    const res = await api.delete(`/banks/${id}`);
    return res.data;
  } catch (err: any) {
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
    const res = await api.get(
      `/attendance/student/${studentId}?year=${year}&month=${month}`
    );
    return res.data;
  } catch (err: any) {
    return err.message;
  }
};

// Payments
export const getAllPayments = async () => {
  try {
    const api = await server();
    const res = await api.get("/payment");
    return res.data;
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export const getFinanceOverview = async () => {
  try {
    const api = await server();
    // Try /payments/overview first (plural), fallback to /payment/overview (singular)
    try {
      const res = await api.get(`/payments/overview`);
      return res.data;
    } catch (firstError: any) {
      if (firstError.response?.status === 404) {
        // Try singular version
        const res = await api.get(`/payment/overview`);
        return res.data;
      }
      throw firstError;
    }
  } catch (err: any) {
    // Only log non-404 errors to avoid console spam
    // 404 errors are handled gracefully by returning default values
    return {
      totalRevenue: 0,
      totalBilling: 0,
      totalPending: 0,
      totalPayments: 0,
      collectionRate: 0,
      topCenters: [],
      topPendingCenters: [],
      topPerformingCenter: null,
      centerPerformanceMatrix: [],
    };
  }
};

// Archive
export const getArchiveRecords = async (options?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  try {
    const api = await server();
    const params = new URLSearchParams();
    if (options?.page) params.append("page", options.page.toString());
    if (options?.limit) params.append("limit", options.limit.toString());
    if (options?.search) params.append("search", options.search);

    const queryString = params.toString();
    const url = `/archive${queryString ? `?${queryString}` : ""}`;
    const res = await api.get(url);
    return res.data;
  } catch (err: any) {
    return { data: [], total: 0, page: 1, limit: 10 };
  }
};

export const getArchiveRecord = async (id: string) => {
  try {
    const api = await server();
    const res = await api.get(`/archive/${id}`);
    return res.data;
  } catch (err: any) {
    throw err; // Re-throw to let the page handle the error
  }
};

export const createArchiveRecord = async (payload: CreateArchiveRecord) => {
  try {
    const api = await server();
    const res = await api.post("/archive", payload);
    return res.data;
  } catch (err: any) {
    throw err;
  }
};

export const bulkUploadArchive = async (payload: BulkUploadArchiveRequest) => {
  try {
    const api = await server();
    const res = await api.post("/archive/bulk-upload", payload);
    return res.data;
  } catch (err: any) {
    throw err;
  }
};

export const updateArchiveRecord = async (
  id: string,
  payload: UpdateArchiveRecord
) => {
  try {
    const api = await server();
    const res = await api.patch(`/archive/${id}`, payload);
    return res.data;
  } catch (err: any) {
    throw err;
  }
};

export const archiveStudentToArchive = async (studentId: string) => {
  try {
    const api = await server();
    const res = await api.post(`/archive/from-student/${studentId}`);
    return res.data;
  } catch (err: any) {
    throw err;
  }
};

export const restoreStudentFromArchive = async (archiveId: string) => {
  try {
    const api = await server();
    const res = await api.post(`/archive/restore/${archiveId}`);
    return res.data;
  } catch (err: any) {
    throw err;
  }
};

export const deleteArchiveRecord = async (id: string) => {
  try {
    const api = await server();
    const res = await api.delete(`/archive/${id}`);
    return res.data;
  } catch (err: any) {
    throw err;
  }
};
