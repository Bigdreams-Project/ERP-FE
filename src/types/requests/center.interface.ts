export interface CreateCenter {
  centerName: string;
  location: string;
  centerAddress: string;
  centerManagerName: string;
  contactPhone: string;
  emailAddress: string;
  status: string;
  document?: FileList | null;
}

export interface UpdateCenter {
  id: string; 
  centerName?: string;
  location?: string;
  centerAddress?: string;
  centerManagerName?: string;
  contactPhone?: string;
  emailAddress?: string;
  status?: string;
  document?: FileList | null;
  updatedAt?: string;          
}
