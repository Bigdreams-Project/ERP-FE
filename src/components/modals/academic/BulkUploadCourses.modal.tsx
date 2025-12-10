"use client";
import {
  BulkUploadCoursesRequest,
  BulkUploadCourseRecord,
  BulkUploadCoursesResponse,
} from "@/types/requests/course.interface";
import * as XLSX from "xlsx";
import { X, Upload, AlertCircle } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

interface BulkUploadCoursesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BulkUploadCoursesRequest) => Promise<BulkUploadCoursesResponse>;
  isUploading?: boolean;
}

const BulkUploadCoursesModal: React.FC<BulkUploadCoursesModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isUploading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<BulkUploadCourseRecord[]>([]);
  const [validationErrors, setValidationErrors] = useState<
    Array<{ row: number; errors: string[] }>
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewRows, setPreviewRows] = useState(10);
  const [duplicateRecords, setDuplicateRecords] = useState<
    Array<{ row: number; oldId: string }>
  >([]);
  const [uploadResult, setUploadResult] =
    useState<BulkUploadCoursesResponse | null>(null);
  const [showFailedRecords, setShowFailedRecords] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      handleReset();
    }
  }, [isOpen]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsProcessing(true);
    setValidationErrors([]);
    setParsedData([]);

    try {
      const data = await parseFile(file);
      setParsedData(data);

      // Validate data
      const errors: Array<{ row: number; errors: string[] }> = [];
      data.forEach((record, index) => {
        const recordErrors: string[] = [];
        if (!record.oldId) recordErrors.push("Old Course ID (_id) is required");
        if (!record.title) recordErrors.push("Title is required");
        if (!record.duration || record.duration < 1)
          recordErrors.push("Duration must be >= 1");
        if (recordErrors.length > 0) {
          errors.push({ row: index + 1, errors: recordErrors });
        }
      });
      setValidationErrors(errors);

      // Detect duplicates based on oldId
      const duplicates: Array<{ row: number; oldId: string }> = [];
      const seenIds = new Map<string, number>();

      data.forEach((record, index) => {
        const rowNum = index + 1;
        if (record.oldId) {
          if (seenIds.has(record.oldId)) {
            duplicates.push({
              row: rowNum,
              oldId: record.oldId,
            });
          } else {
            seenIds.set(record.oldId, rowNum);
          }
        }
      });

      setDuplicateRecords(duplicates);
    } catch (error: any) {
      console.error("Failed to parse file:", error);
      alert(`Failed to parse file: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const parseFile = async (file: File): Promise<BulkUploadCourseRecord[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          // XLSX can handle both Excel and CSV files
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const mappedData: BulkUploadCourseRecord[] = jsonData
            .filter((row: any) => row._id || row.oldId || row.title)
            .map((row: any) => ({
              oldId: String(row._id || row.oldId || ""),
              title: String(row.title || ""),
              duration: parseInt(String(row.duration || 0), 10),
            }))
            .filter(
              (record) => record.oldId && record.title && record.duration > 0
            );

          resolve(mappedData);
        } catch (error: any) {
          reject(new Error(`Failed to parse file: ${error.message}`));
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsBinaryString(file);
    });
  };

  const handleUpload = async () => {
    if (isUploading) {
      return;
    }

    if (parsedData.length === 0) {
      alert("No data to upload. Please select a file first.");
      return;
    }

    // Filter out records with validation errors AND duplicates
    const seenIds = new Set<string>();
    const validRecords = parsedData.filter((record, index) => {
      const rowNum = index + 1;

      // Skip if has validation errors
      if (validationErrors.some((error) => error.row === rowNum)) {
        return false;
      }

      // Skip if duplicate (keep first occurrence only)
      if (record.oldId && seenIds.has(record.oldId)) {
        return false;
      }

      // Mark as seen
      if (record.oldId) {
        seenIds.add(record.oldId);
      }

      return true;
    });

    if (validRecords.length === 0) {
      alert("No valid records to upload. Please fix the errors in your file.");
      return;
    }

    // Call onSave
    try {
      const result = await onSave({ records: validRecords });
      setUploadResult(result);
      setShowFailedRecords(false);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setParsedData([]);
    setValidationErrors([]);
    setDuplicateRecords([]);
    setUploadResult(null);
    setShowFailedRecords(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!isOpen) return null;

  const validRecordsCount =
    parsedData.length - validationErrors.length - duplicateRecords.length;
  const errorRecordsCount = validationErrors.length;
  const canUpload = parsedData.length > 0 && validRecordsCount > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4 font-sans">
      <div className="relative bg-white p-6 rounded-2xl shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Bulk Upload Courses</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="mt-6 flex flex-col h-full overflow-y-auto pr-2 custom-scroll">
          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload CSV/Excel File *
            </label>
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="courses-file-input"
              />
              <label
                htmlFor="courses-file-input"
                className="flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-colors bg-blue-600 text-white hover:bg-blue-700"
              >
                <Upload size={18} />
                Choose File
              </label>
              {selectedFile && (
                <span className="text-sm text-gray-600">{selectedFile.name}</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: CSV (.csv) or Excel (.xlsx, .xls)
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
                  {duplicateRecords.length > 0 && (
                    <span className="text-amber-600">
                      Duplicates: {duplicateRecords.length} record(s)
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Upload Results */}
          {uploadResult && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h3 className="font-semibold text-gray-800 mb-2">Upload Results</h3>
              <div className="flex gap-4 text-sm mb-2">
                <span>Total: {uploadResult.total}</span>
                <span className="text-green-600">
                  Success: {uploadResult.success}
                </span>
                <span className="text-red-600">Failed: {uploadResult.failed}</span>
                <span className="text-amber-600">
                  Skipped: {uploadResult.skipped}
                </span>
              </div>

              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowFailedRecords(!showFailedRecords)}
                    className="text-sm text-red-600 hover:text-red-800 underline mb-2"
                  >
                    {showFailedRecords ? "Hide Errors" : "Show Errors"}
                  </button>
                  {showFailedRecords && (
                    <div className="max-h-60 overflow-y-auto border border-red-200 rounded bg-white">
                      <table className="min-w-full text-sm">
                        <thead className="bg-red-100 sticky top-0">
                          <tr>
                            <th className="p-2 text-left border">Row #</th>
                            <th className="p-2 text-left border">Error Message</th>
                          </tr>
                        </thead>
                        <tbody>
                          {uploadResult.errors.map((error, index) => (
                            <tr key={index} className="hover:bg-red-50">
                              <td className="p-2 border font-medium text-gray-700">
                                {error.row}
                              </td>
                              <td className="p-2 border text-red-700">
                                {error.error}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Duplicate Records Warning */}
          {duplicateRecords.length > 0 && (
            <div className="mb-6 p-4 bg-amber-50 rounded-md border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-amber-600" size={18} />
                <h3 className="font-semibold text-amber-800">
                  Duplicate Records Found ({duplicateRecords.length} row(s))
                </h3>
              </div>
              <p className="text-sm text-amber-700 mb-2">
                The following records have duplicate Course IDs. Only the first
                occurrence will be uploaded:
              </p>
              <div className="max-h-40 overflow-y-auto">
                {duplicateRecords.slice(0, 10).map((dup, index) => (
                  <div key={index} className="text-sm text-amber-700 mb-1">
                    Row {dup.row}: Course ID "{dup.oldId}" (duplicate - will be
                    ignored)
                  </div>
                ))}
                {duplicateRecords.length > 10 && (
                  <p className="text-sm text-amber-600 mt-2">
                    ... and {duplicateRecords.length - 10} more duplicate(s)
                  </p>
                )}
              </div>
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
                {validationErrors.slice(0, 10).map((error, index) => (
                  <div key={index} className="text-sm text-red-700 mb-1">
                    Row {error.row}: {error.errors.join(", ")}
                  </div>
                ))}
                {validationErrors.length > 10 && (
                  <p className="text-sm text-red-600 mt-2">
                    ... and {validationErrors.length - 10} more error(s)
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
                      <th className="p-2 text-left border">#</th>
                      <th className="p-2 text-left border">Old Course ID</th>
                      <th className="p-2 text-left border">Title</th>
                      <th className="p-2 text-left border">Duration (months)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.slice(0, previewRows).map((record, index) => {
                      const rowNum = index + 1;
                      const hasError = validationErrors.some(
                        (e) => e.row === rowNum
                      );
                      const isDuplicate = duplicateRecords.some(
                        (d) => d.row === rowNum
                      );
                      return (
                        <tr
                          key={index}
                          className={`${
                            hasError
                              ? "bg-red-50"
                              : isDuplicate
                              ? "bg-amber-50"
                              : ""
                          }`}
                        >
                          <td className="p-2 border font-medium text-gray-600">
                            {rowNum}
                          </td>
                          <td className="p-2 border">{record.oldId || "-"}</td>
                          <td className="p-2 border">{record.title || "-"}</td>
                          <td className="p-2 border">
                            {record.duration || "-"} month(s)
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Sticky */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 sticky bottom-0 bg-white">
          <button
            type="button"
            onClick={() => {
              if (!isUploading) {
                handleReset();
                onClose();
              }
            }}
            disabled={isUploading}
            className={`px-6 py-2 text-gray-700 bg-gray-200 rounded-md transition-colors ${
              isUploading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-300"
            }`}
          >
            Cancel
          </button>
          {parsedData.length > 0 && !isUploading && (
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
            disabled={!canUpload || isUploading}
            className={`px-6 py-2 rounded-md transition-colors flex items-center gap-2 ${
              canUpload && !isUploading
                ? "text-white bg-add-button hover:bg-indigo-700"
                : "bg-gray-400 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload size={16} />
                <span>
                  Upload {validRecordsCount > 0 ? `${validRecordsCount} Record(s)` : ""}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadCoursesModal;

