export interface File {
  id: string;
  studentId: string;
  fileName: string;
  fileType: "payment_receipt" | "profile_image";
  fileUrl: string;
  presignedURL?: string; // Presigned URL for accessing the file (returned by backend with capital URL)
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




