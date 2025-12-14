"use client";
import { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { uploadFileClient, getStudentFilesClient } from "@/lib/client-network";
import { showError, showSuccess } from "@/lib/toast";
import { File as StudentFile } from "@/types/academic/file.interface";
import { Student } from "@/types/academic/student.interface";
import Card from "./Card";
import { formatDate } from "@/lib/utils";

interface ProofOfPaymentUploadProps {
  data: Student;
}

const ProofOfPaymentUpload = ({ data }: ProofOfPaymentUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  // Fetch uploaded files
  const { data: files = [], refetch, isLoading: isLoadingFiles } = useQuery({
    queryKey: ["student-files", data.id, "payment_receipt"],
    queryFn: () => getStudentFilesClient(data.id, "payment_receipt"),
  });

  const CloudUpload = (props: any) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 7.5L14 21h-2" />
      <path d="m16 16-4-4-4 4" />
      <path d="M12 12v9" />
    </svg>
  );

  const handleFileSelect = async (file: globalThis.File) => {
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      showError("Invalid file type. Only PDF, JPG, and PNG are accepted.");
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showError("File size exceeds 5MB limit.");
      return;
    }

    setIsUploading(true);
    try {
      const uploadResponse = await uploadFileClient(file, data.id, "payment_receipt");
      
      // Log the upload response to see presignedURL
      console.log("Upload response:", uploadResponse);
      console.log("Presigned URL from upload:", uploadResponse?.presignedURL);
      
      showSuccess("File uploaded successfully!");
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["student-files"] });
    } catch (error: any) {
      showError(error.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const paymentReceipts = files.filter(
    (file: StudentFile) => file.fileType === "payment_receipt"
  );

  return (
    <Card title="Upload Proof of Payment" className="h-">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Accepted formats: PDF, JPG, PNG (max 5MB)
      </p>

      {/* Drag and Drop Area */}
      <div
        className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl mb-6 text-center cursor-pointer transition duration-150 ${
          isDragging
            ? "border-blue-500 dark:border-blue-400 bg-blue-100 dark:bg-blue-900/40"
            : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        } ${isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {isUploading ? (
          <>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400 mb-2"></div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Uploading...</p>
          </>
        ) : (
          <>
            <CloudUpload className="text-gray-400 dark:text-gray-500 mb-2" />
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Drag & drop files here or click to upload
            </p>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileInputChange}
          disabled={isUploading}
        />
      </div>

      {/* Recently Uploaded */}
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Recently Uploaded:
      </h3>
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {isLoadingFiles ? (
          <div className="flex items-center gap-2 py-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 dark:border-blue-400"></div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Loading receipts...
            </p>
          </div>
        ) : paymentReceipts.length > 0 ? (
          paymentReceipts.map((file: StudentFile) => {
            // Use presignedURL (capital URL) from backend, fallback to fileUrl
            const fileUrl = file.presignedURL || file.fileUrl;
            console.log(`File ${file.fileName} - presignedURL:`, file.presignedURL, "fileUrl:", file.fileUrl);
            
            return (
              <a
                key={file.id}
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                {file.fileName} - {formatDate(file.uploadedAt)}
              </a>
            );
          })
        ) : (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            No receipts available. Please upload.
          </p>
        )}
      </div>
    </Card>
  );
};

export default ProofOfPaymentUpload;
