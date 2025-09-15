import { Lead } from "./lead.interface";
import { Student } from "./student.interface";

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
  fullname: string;
  email: string;
  image: string;
  certificates: Certificate[];
  phone: string;
  centerId: string;
}

export interface Center {
  id: string;
  name: string;
  email: string;
  code: string;
  phone: string;
  address: string;
  status: string;
  managers: Manager[];
  faculties: Manager[];
  academicHead: Manager;
  students: Student[];
  leads: Lead[];
  notes: CenterNote[];
  regionalManager: Manager;
  createdAt: string;
  updatedAt: string;
}

export interface ICenter {
  centerName: string;
  location: string;
  centerAddress: string;
  centerManagerName: string;
  contactPhone: string;
  emailAddress: string;
  status: string;
  document: FileList | null;
}

export interface ICenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (centerData: ICenter, isDraft: boolean) => void;
  initialData?: Partial<ICenter>;
  mode: "add" | "edit";
}
