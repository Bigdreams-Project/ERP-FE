export interface ArchiveRecord {
  id?: string;
  centerId: string; // REQUIRED - for RBAC: Used to filter records by center for non-admin users
  userOldId: string;
  userNewId?: string | null;
  fullname: string;
  email: string;
  phone: string;
  courseEnrolled: string;
  coursePrice: number;
  enrollmentDate: string;
  birthDate: string;
  oldStudentId: string;
  newStudentId?: string | null;
  totalPayment: number;
  pendingPayment: number;
  status: string;
  source?: "legacy_erp" | "graduated"; // Future-proofing
  createdAt?: string;
  updatedAt?: string;
}

