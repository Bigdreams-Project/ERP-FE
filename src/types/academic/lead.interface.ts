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
  fullname: string;
  email: string;
  phone: string;
  address: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string | null;
  course: string;
  enquiryDate: string;
  source: string;
  status: string;
  nextFollowup: string;
  studyType: string;
  note: string;
}

export interface ILeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: ILead) => void;
  initialData?: {
    fullname?: string;
    phone?: string;
    email?: string;
    address?: string;
    parentName?: string;
    parentPhone?: string;
    parentEmail?: string;
    course?: {
      name?: string;
      fee?: string;
      baseFee?: string;
    };
    enquiryDate?: string;
    source?: string;
    status?: string;
    nextFollowup?: string;
    studyType?: string;
    note: string;
  };
  mode: "add" | "edit";
}
