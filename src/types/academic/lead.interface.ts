import { CreateLead } from "../requests/lead.interface";
import { Center } from "./center.interface";
import { Course } from "./course.interface";
import { Guardian } from "./student.interface";

export interface Document {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeadNote {
  id: string;
  title: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  fullName: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  centerId: string;
  courseId: string;
  course: Course;
  enquiryDate: string;
  source: string;
  status: string;
  nextFollowUpDate: string;
  studyType: string;
  guardians: Guardian[];
  notes: LeadNote[];
  documents: Document[];
  createdAt?: string;
}

export interface ILead {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string | null;
  centerId: string;
  courseId: string;
  enquiryDate: string;
  source: string;
  status: string;
  assignedTo: string;
  lastFollowUpDate: string;
  nextFollowUpDate: string;
  studyType: string;
  note: string;
}

export interface ILeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: CreateLead) => void;
  centers: Center[];
  courses: Course[];
  initialData?: {
    fullName?: string;
    phone?: string;
    email?: string;
    address?: string;
    parentName?: string;
    parentPhone?: string;
    parentEmail?: string;
    centerId?: string;
    courseId?: string;
    enquiryDate?: string;
    source?: string;
    status?: string;
    assignedTo?: string;
    lastFollowUpDate?: string;
    nextFollowUpDate?: string;
    studyType?: string;
    note: string;
  };
  mode: "add" | "edit";
}

export interface IDeleteModalProps {
  title: string;
  subtitle: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}
