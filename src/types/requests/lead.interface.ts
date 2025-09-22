export interface CreateLead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  courseId: string;
  centerId: string;
  enquiryDate: string;         
  nextFollowUpDate?: string;
  lastFollowUpDate?: string;
  note: string;
  source: string;
  status: string;
  studyType: string;
  assignedTo?: string;         
  createdAt: string;
  updatedAt: string;
}

export interface UpdateLead {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  courseId?: string;
  centerId?: string;
  enquiryDate?: string;
  nextFollowUpDate?: string;
  lastFollowUpDate?: string;
  note?: string;
  source?: string;
  status?: string;
  studyType?: string;
  assignedTo?: string;
  createdAt?: string;
  updatedAt?: string;
}
