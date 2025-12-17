import { IBank } from "../finance/bank.interface";
import { CreateCenter } from "../requests/center.interface";
import { Lead } from "./lead.interface";
import { Student } from "./student.interface";
import type { Bank } from "../finance/bank.interface";

export type CenterStatus = "ACTIVE" | "IN_SETUP" | "SUSPENDED" | "CLOSED";

export type CenterType = "OWNED" | "PARTNERED";

export interface Certificate {
  name: string;
  url: string;
  managerId: string;
  staffId: string;
}

export interface CenterNote {
  id: string;
  title: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface Manager {
  id?: string;
  fullname: string;
  email: string;
  image: string;
  certificates: Certificate[];
  phone: string;
  centerId: string;
}

export interface CenterLocation {
  state: string;
  capital: string;
}

export interface Center {
  id: string;
  name: string;
  email: string;
  code: string;
  phone: string;
  location: CenterLocation | null;
  address: string;
  status: string;
  type: string;
  manager: Manager;
  faculties: Manager[];
  academicHead: Manager;
  students: Student[];
  leads: Lead[];
  notes: CenterNote[];
  regionalManager: Manager | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  // New fields from backend API
  banks?: Bank[];
  studentCount?: number;
  facultyCount?: number;
}

export interface ICenter {
  name: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  managerId: string;
  status: CenterStatus | "";
  type: CenterType | "";
  banks: IBank[];
}

export interface ICenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CreateCenter, isDraft: boolean) => void;
  initialData?: Partial<ICenter>;
  managers: Manager[];
  mode: "add" | "edit";
}

export interface CourseFeeAssignment {
  id: string;
  centerId: string;
  lumpSumFee: number;
  baseFee: number;
  maxInstallments: number;
  costPerInstallment: number;
  oldCourseFee?: number;
  center: Center
}

export interface ICourseFeeAssignment {
  centerId: string;
  lumpSumFee: number;
  baseFee: number;
  maxInstallments: number;
  costPerInstallment: number;
  oldCourseFee?: number;
}

export interface IEditCourseFeeAssignment {
  id: string;
  centerId: string;
  lumpSumFee: number;
  baseFee: number;
  maxInstallments: number;
  costPerInstallment: number;
  oldCourseFee?: number;
}

export interface ICoursePricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  centers: Center[];
  onSave: (data: ICourseFeeAssignment) => void;
  isSaving: boolean;
}

export interface IEditCoursePricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  centers: Center[];
  onSave: (data: IEditCourseFeeAssignment) => void;
  isSaving: boolean;
  initialData?: Partial<CourseFeeAssignment>;
}
