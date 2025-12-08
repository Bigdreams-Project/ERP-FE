export interface File {
  id: string;
  studentId: string;
  fileName: string;
  fileType: "payment_receipt" | "profile_image";
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedBy?: string;
  uploadedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFileRequest {
  studentId: string;
  fileType: "payment_receipt" | "profile_image";
  fileName: string;
  fileSize: number;
  mimeType: string;
  fileUrl: string;
}




