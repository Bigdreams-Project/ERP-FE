"use client";
import { Center } from "@/types/academic/center.interface";
import { ArchiveRecord } from "@/types/academic/archive.interface";
import { BulkUploadArchiveRequest } from "@/types/requests/archive.interface";
import { archiveRecordSchema } from "@/validations/academic/archive.validation";
import * as XLSX from "xlsx";
import { X, Upload, AlertCircle } from "lucide-react";
import React, { useState, useRef } from "react";
import { useIsAdmin } from "@/hooks/useIsAdmin";

interface ArchiveUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BulkUploadArchiveRequest) => void;
  centers: Center[];
}

const ArchiveUploadModal: React.FC<ArchiveUploadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  centers,
}) => {
  const { isAdmin } = useIsAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCenterId, setSelectedCenterId] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ArchiveRecord[]>([]);
  const [validationErrors, setValidationErrors] = useState<
    Array<{ row: number; errors: string[] }>
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewRows, setPreviewRows] = useState(10);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsProcessing(true);
    setValidationErrors([]);
    setParsedData([]);

    try {
      const data = await readExcelFile(file);
      setParsedData(data);
      
      // Validate data
      const errors: Array<{ row: number; errors: string[] }> = [];
      data.forEach((record, index) => {
        try {
          archiveRecordSchema.validateSync(record, { abortEarly: false });
        } catch (error: any) {
          errors.push({
            row: index + 1,
            errors: error.errors || [error.message],
          });
        }
      });
      setValidationErrors(errors);
    } catch (error: any) {
      console.error("Failed to parse file:", error);
      alert(`Failed to parse file: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const readExcelFile = (file: File): Promise<ArchiveRecord[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // Map Excel columns to ArchiveRecord fields
          const mappedData: ArchiveRecord[] = jsonData.map((row: any, index: number) => {
            // Try to map common column name variations
            const mapField = (excelName: string, variations: string[]) => {
              const lowerRow = Object.keys(row).reduce((acc, key) => {
                acc[key.toLowerCase().trim()] = row[key];
                return acc;
              }, {} as any);

              for (const variation of variations) {
                const lowerVar = variation.toLowerCase().trim();
                if (lowerRow[lowerVar] !== undefined) {
                  return lowerRow[lowerVar];
                }
              }
              return null;
            };

            return {
              centerId: selectedCenterId || "", // Will be assigned later if not in file
              userOldId: mapField("userOldId", ["useroldid", "user old id", "old user id", "user_old_id"]) || "",
              userNewId: mapField("userNewId", ["usernewid", "user new id", "new user id", "user_new_id"]) || null,
              fullname: mapField("fullname", ["fullname", "full name", "name", "student name"]) || "",
              email: mapField("email", ["email", "e-mail"]) || "",
              phone: mapField("phone", ["phone", "phone number", "mobile", "contact"]) || "",
              courseEnrolled: mapField("courseEnrolled", ["courseenrolled", "course enrolled", "course", "course name"]) || "",
              coursePrice: parseFloat(mapField("coursePrice", ["courseprice", "course price", "price", "fee"]) || "0") || 0,
              enrollmentDate: formatDateForArchive(mapField("enrollmentDate", ["enrollmentdate", "enrollment date", "enrolled date", "enroll_date"]) || ""),
              birthDate: formatDateForArchive(mapField("birthDate", ["birthdate", "birth date", "dob", "date of birth"]) || ""),
              oldStudentId: mapField("oldStudentId", ["oldstudentid", "old student id", "student old id", "old_student_id"]) || "",
              newStudentId: mapField("newStudentId", ["newstudentid", "new student id", "student new id", "new_student_id"]) || null,
              totalPayment: parseFloat(mapField("totalPayment", ["totalpayment", "total payment", "paid", "amount paid"]) || "0") || 0,
              pendingPayment: parseFloat(mapField("pendingPayment", ["pendingpayment", "pending payment", "balance", "outstanding"]) || "0") || 0,
              status: mapField("status", ["status", "student status"]) || "archived",
              source: (mapField("source", ["source", "archive source"]) || "legacy_erp") as "legacy_erp" | "graduated",
            };
          });

          resolve(mappedData);
        } catch (error: any) {
          reject(new Error(`Failed to parse Excel file: ${error.message}`));
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsBinaryString(file);
    });
  };

  const formatDateForArchive = (dateValue: any): string => {
    if (!dateValue) return "";
    
    // Handle Excel date serial numbers
    if (typeof dateValue === "number") {
      const excelEpoch = new Date(1899, 11, 30);
      const date = new Date(excelEpoch.getTime() + dateValue * 86400000);
      return date.toISOString().split("T")[0];
    }
    
    // Handle string dates
    if (typeof dateValue === "string") {
      const date = new Date(dateValue);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0];
      }
    }
    
    return "";
  };

  const handleUpload = () => {
    if (!selectedCenterId) {
      alert("Please select a center");
      return;
    }

    if (parsedData.length === 0) {
      alert("No data to upload. Please select a file first.");
      return;
    }

    // Assign centerId to all records (override any centerId from file)
    const recordsWithCenter = parsedData.map((record) => ({
      ...record,
      centerId: selectedCenterId, // Always use selected center
    }));

    // Filter out records with validation errors
    const validRecords = recordsWithCenter.filter((record, index) => {
      return !validationErrors.some((error) => error.row === index + 1);
    });

    if (validRecords.length === 0) {
      alert("No valid records to upload. Please fix the errors in your file.");
      return;
    }

    onSave({ records: validRecords });
  };

  const handleReset = () => {
    setSelectedFile(null);
    setParsedData([]);
    setValidationErrors([]);
    setSelectedCenterId("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!isOpen) return null;

  const validRecordsCount = parsedData.length - validationErrors.length;
  const errorRecordsCount = validationErrors.length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4 font-sans overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Upload Archive Records</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Center Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Center *
            </label>
            <select
              value={selectedCenterId}
              onChange={(e) => setSelectedCenterId(e.target.value)}
              className="w-full h-10 px-4 text-sm text-gray-600 rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              disabled={!isAdmin}
            >
              <option value="">Select Center</option>
              {centers.map((center) => (
                <option key={center.id} value={center.id}>
                  {center.name}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Excel/CSV File *
            </label>
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="hidden"
                id="archive-file-input"
              />
              <label
                htmlFor="archive-file-input"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <Upload size={18} />
                Choose File
              </label>
              {selectedFile && (
                <span className="text-sm text-gray-600">{selectedFile.name}</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: Excel (.xlsx, .xls) or CSV
            </p>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="mb-4 p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-700">Processing file...</p>
            </div>
          )}

          {/* Summary */}
          {parsedData.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">Upload Summary</h3>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600">
                    Valid: {validRecordsCount} record(s)
                  </span>
                  {errorRecordsCount > 0 && (
                    <span className="text-red-600">
                      Errors: {errorRecordsCount} record(s)
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Center: {centers.find((c) => c.id === selectedCenterId)?.name || "Not selected"}
              </p>
            </div>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 rounded-md border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-red-600" size={18} />
                <h3 className="font-semibold text-red-800">
                  Validation Errors ({validationErrors.length} row(s))
                </h3>
              </div>
              <div className="max-h-40 overflow-y-auto">
                {validationErrors.slice(0, 5).map((error, index) => (
                  <div key={index} className="text-sm text-red-700 mb-1">
                    Row {error.row}: {error.errors.join(", ")}
                  </div>
                ))}
                {validationErrors.length > 5 && (
                  <p className="text-sm text-red-600 mt-2">
                    ... and {validationErrors.length - 5} more error(s)
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Preview Table */}
          {parsedData.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">
                  Preview (First {Math.min(previewRows, parsedData.length)} rows)
                </h3>
                <select
                  value={previewRows}
                  onChange={(e) => setPreviewRows(Number(e.target.value))}
                  className="text-sm px-2 py-1 border rounded"
                >
                  <option value={10}>10 rows</option>
                  <option value={20}>20 rows</option>
                  <option value={50}>50 rows</option>
                </select>
              </div>
              <div className="overflow-x-auto max-h-96 border rounded">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="p-2 text-left border">User OLD ID</th>
                      <th className="p-2 text-left border">Full Name</th>
                      <th className="p-2 text-left border">Email</th>
                      <th className="p-2 text-left border">Phone</th>
                      <th className="p-2 text-left border">Course</th>
                      <th className="p-2 text-left border">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.slice(0, previewRows).map((record, index) => {
                      const hasError = validationErrors.some((e) => e.row === index + 1);
                      return (
                        <tr
                          key={index}
                          className={hasError ? "bg-red-50" : ""}
                        >
                          <td className="p-2 border">{record.userOldId}</td>
                          <td className="p-2 border">{record.fullname}</td>
                          <td className="p-2 border">{record.email}</td>
                          <td className="p-2 border">{record.phone}</td>
                          <td className="p-2 border">{record.courseEnrolled}</td>
                          <td className="p-2 border">{record.status}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                handleReset();
                onClose();
              }}
              className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            {parsedData.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="px-6 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Reset
              </button>
            )}
            <button
              type="button"
              onClick={handleUpload}
              disabled={!selectedCenterId || parsedData.length === 0 || validRecordsCount === 0}
              className="px-6 py-2 text-white bg-add-button rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Upload {validRecordsCount > 0 ? `${validRecordsCount} Record(s)` : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchiveUploadModal;

