"use client";
import {
  BulkUploadCoursesRequest,
  BulkUploadCourseRecord,
  BulkUploadCoursesResponse,
  BulkUploadRegularCourseRecord,
  BulkUploadRegularCoursesRequest,
} from "@/types/requests/course.interface";
import * as XLSX from "xlsx";
import { X, Upload, AlertCircle } from "lucide-react";
import React, { useState, useRef, useEffect, useMemo } from "react";

type UploadType = "old" | "new" | null;

interface BulkUploadCoursesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BulkUploadCoursesRequest | BulkUploadRegularCoursesRequest, type: UploadType) => Promise<any>;
  isUploading?: boolean;
}

const BulkUploadCoursesModal: React.FC<BulkUploadCoursesModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isUploading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadType, setUploadType] = useState<UploadType>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<
    Array<{ row: number; errors: string[] }>
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewRows, setPreviewRows] = useState<number>(10);
  const [duplicateRecords, setDuplicateRecords] = useState<
    Array<{ row: number; oldId?: string; title?: string; course_type?: string }>
  >([]);
  const [skippedRecords, setSkippedRecords] = useState<
    Array<{ row: number; reason: string; oldId?: string; title?: string; course_type?: string }>
  >([]);
  const [uploadResult, setUploadResult] = useState<any | null>(null);
  const [showFailedRecords, setShowFailedRecords] = useState(false);
  const [showSkippedRecords, setShowSkippedRecords] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      handleReset();
    }
  }, [isOpen]);

  const handleUploadTypeSelect = (type: "old" | "new") => {
    setUploadType(type);
    handleReset();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !uploadType) return;

    setSelectedFile(file);
    setIsProcessing(true);
    setValidationErrors([]);
    setParsedData([]);
    setDuplicateRecords([]);
    setSkippedRecords([]);
    setPreviewRows(10); // Reset preview rows to default when loading new file

    try {
      const data = uploadType === "old" 
        ? await parseOldCoursesFile(file)
        : await parseNewCoursesFile(file);
      setParsedData(data);

      // Validate data based on type
      const errors: Array<{ row: number; errors: string[] }> = [];
      if (uploadType === "old") {
        (data as BulkUploadCourseRecord[]).forEach((record: BulkUploadCourseRecord, index: number) => {
          const recordErrors: string[] = [];
          if (!record.oldId || String(record.oldId).trim() === "") recordErrors.push("Old Course ID (_id) is required");
          if (!record.title || String(record.title).trim() === "") recordErrors.push("Title is required");
          if (!record.duration || record.duration < 1)
            recordErrors.push("Duration must be >= 1");
          if (recordErrors.length > 0) {
            errors.push({ row: index + 1, errors: recordErrors });
          }
        });

        // Detect duplicates based on oldId
        const duplicates: Array<{ row: number; oldId: string }> = [];
        const seenIds = new Map<string, number>();

        (data as BulkUploadCourseRecord[]).forEach((record: BulkUploadCourseRecord, index: number) => {
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
      } else {
        // New courses validation
        (data as BulkUploadRegularCourseRecord[]).forEach((record: BulkUploadRegularCourseRecord, index: number) => {
          const recordErrors: string[] = [];
          if (!record.title || String(record.title).trim() === "") recordErrors.push("Title is required");
          if (!record.duration || record.duration < 1)
            recordErrors.push("Duration must be >= 1");
          if (!record.course_type || String(record.course_type).trim() === "") recordErrors.push("Course Type is required");
          if (recordErrors.length > 0) {
            errors.push({ row: index + 1, errors: recordErrors });
          }
        });

        // Detect duplicates based on title AND course_type for new courses
        // A course is only a duplicate if it has the same title AND the same course_type
        const duplicates: Array<{ row: number; title: string; course_type: string }> = [];
        const seenCombinations = new Map<string, number>();

        (data as BulkUploadRegularCourseRecord[]).forEach((record: BulkUploadRegularCourseRecord, index: number) => {
          const rowNum = index + 1;
          if (record.title && record.course_type) {
            // Create a composite key from title and course_type
            const titleLower = record.title.toLowerCase().trim();
            const courseTypeLower = record.course_type.toLowerCase().trim();
            const compositeKey = `${titleLower}::${courseTypeLower}`;
            
            if (seenCombinations.has(compositeKey)) {
              duplicates.push({
                row: rowNum,
                title: record.title,
                course_type: record.course_type,
              });
            } else {
              seenCombinations.set(compositeKey, rowNum);
            }
          }
        });
        setDuplicateRecords(duplicates);
      }

      setValidationErrors(errors);
    } catch (error: any) {
      alert(`Failed to parse file: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const parseOldCoursesFile = async (file: File): Promise<BulkUploadCourseRecord[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const mappedData: BulkUploadCourseRecord[] = jsonData
            .filter((row: any) => row._id || row.oldId || row.title)
            .map((row: any) => ({
              oldId: String(row._id || row.oldId || "").trim(),
              title: String(row.title || "").trim(),
              duration: parseInt(String(row.duration || 0), 10),
              old_price: row.old_price !== undefined && row.old_price !== null && row.old_price !== "" 
                ? parseFloat(String(row.old_price)) 
                : undefined,
              new_price: row.new_price !== undefined && row.new_price !== null && row.new_price !== "" 
                ? parseFloat(String(row.new_price)) 
                : undefined,
              course_type: row.course_type !== undefined && row.course_type !== null && row.course_type !== "" 
                ? String(row.course_type || row.courseType || "").trim()
                : undefined,
            }));

          resolve(mappedData);
        } catch (error: any) {
          reject(new Error(`Failed to parse file: ${error.message}`));
        }
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsBinaryString(file);
    });
  };

  const parseNewCoursesFile = async (file: File): Promise<BulkUploadRegularCourseRecord[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const mappedData: BulkUploadRegularCourseRecord[] = jsonData
            .filter((row: any) => row.title || row.duration || row.course_type)
            .map((row: any) => ({
              title: String(row.title || "").trim(),
              duration: parseInt(String(row.duration || 0), 10),
              course_type: String(row.course_type || row.courseType || "").trim(),
              old_price: row.old_price !== undefined && row.old_price !== null && row.old_price !== "" 
                ? parseFloat(String(row.old_price)) 
                : undefined,
              new_price: row.new_price !== undefined && row.new_price !== null && row.new_price !== "" 
                ? parseFloat(String(row.new_price)) 
                : undefined,
            }));

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
    if (isUploading || !uploadType) {
      return;
    }

    if (parsedData.length === 0) {
      alert("No data to upload. Please select a file first.");
      return;
    }

    // Filter out records with validation errors AND duplicates
    // Track skipped records with reasons
    let validRecords: any[] = [];
    const skipped: Array<{ row: number; reason: string; oldId?: string; title?: string; course_type?: string }> = [];
    
    if (uploadType === "old") {
      const seenIds = new Map<string, number>();
      validRecords = parsedData.filter((record: BulkUploadCourseRecord, index: number) => {
        const rowNum = index + 1;

        // Skip if has validation errors
        if (validationErrors.some((error) => error.row === rowNum)) {
          skipped.push({
            row: rowNum,
            reason: "Validation errors",
            oldId: record.oldId,
            title: record.title,
          });
          return false;
        }

        // Skip if duplicate (keep first occurrence only)
        if (record.oldId && seenIds.has(record.oldId)) {
          const firstRow = seenIds.get(record.oldId);
          skipped.push({
            row: rowNum,
            reason: `Duplicate Course ID: "${record.oldId}" (first occurrence at row ${firstRow})`,
            oldId: record.oldId,
            title: record.title,
          });
          return false;
        }

        // Mark as seen
        if (record.oldId) {
          seenIds.set(record.oldId, rowNum);
        }

        return true;
      });
    } else {
      const seenCombinations = new Map<string, number>();
      validRecords = parsedData.filter((record: BulkUploadRegularCourseRecord, index: number) => {
        const rowNum = index + 1;

        // Skip if has validation errors
        if (validationErrors.some((error) => error.row === rowNum)) {
          skipped.push({
            row: rowNum,
            reason: "Validation errors",
            title: record.title,
            course_type: record.course_type,
          });
          return false;
        }

        // Skip if duplicate (keep first occurrence only)
        // A course is only a duplicate if it has the same title AND the same course_type
        if (record.title && record.course_type) {
          const titleLower = record.title.toLowerCase().trim();
          const courseTypeLower = record.course_type.toLowerCase().trim();
          const compositeKey = `${titleLower}::${courseTypeLower}`;
          
          if (seenCombinations.has(compositeKey)) {
            const firstRow = seenCombinations.get(compositeKey);
            skipped.push({
              row: rowNum,
              reason: `Duplicate course: "${record.title}" with course type "${record.course_type}" (first occurrence at row ${firstRow})`,
              title: record.title,
              course_type: record.course_type,
            });
            return false;
          }

          // Mark as seen
          seenCombinations.set(compositeKey, rowNum);
        }

        return true;
      });
    }

    // Update skipped records state
    setSkippedRecords(skipped);

    if (validRecords.length === 0) {
      alert("No valid records to upload. Please fix the errors in your file.");
      return;
    }

    // Call onSave with appropriate payload
    try {
      const payload = uploadType === "old" 
        ? { records: validRecords as BulkUploadCourseRecord[] }
        : { records: validRecords as BulkUploadRegularCourseRecord[] };
      
      const result = await onSave(payload, uploadType);
      setUploadResult(result);
      setShowFailedRecords(false);
    } catch (error) {
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setParsedData([]);
    setValidationErrors([]);
    setDuplicateRecords([]);
    setSkippedRecords([]);
    setUploadResult(null);
    setShowFailedRecords(false);
    setShowSkippedRecords(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBackToSelection = () => {
    setUploadType(null);
    handleReset();
  };

  // Calculate skipped records and valid records count using the same logic as handleUpload
  // IMPORTANT: This hook must be called before any conditional returns to follow Rules of Hooks
  const { validRecordsCount, calculatedSkippedRecords } = useMemo(() => {
    if (parsedData.length === 0 || !uploadType) {
      return { validRecordsCount: 0, calculatedSkippedRecords: [] };
    }
    
    const skipped: Array<{ row: number; reason: string; oldId?: string; title?: string; course_type?: string }> = [];
    
    if (uploadType === "old") {
      const seenIds = new Map<string, number>();
      const validCount = parsedData.filter((record: BulkUploadCourseRecord, index: number) => {
        const rowNum = index + 1;
        
        // Skip if has validation errors
        if (validationErrors.some((error) => error.row === rowNum)) {
          skipped.push({
            row: rowNum,
            reason: "Validation errors",
            oldId: record.oldId,
            title: record.title,
          });
          return false;
        }
        
        // Skip if duplicate (keep first occurrence only)
        if (record.oldId && seenIds.has(record.oldId)) {
          const firstRow = seenIds.get(record.oldId);
          skipped.push({
            row: rowNum,
            reason: `Duplicate Course ID: "${record.oldId}" (first occurrence at row ${firstRow})`,
            oldId: record.oldId,
            title: record.title,
          });
          return false;
        }
        
        // Mark as seen
        if (record.oldId) {
          seenIds.set(record.oldId, rowNum);
        }
        
        return true;
      }).length;
      
      return { validRecordsCount: validCount, calculatedSkippedRecords: skipped };
    } else {
      const seenCombinations = new Map<string, number>();
      const validCount = parsedData.filter((record: BulkUploadRegularCourseRecord, index: number) => {
        const rowNum = index + 1;
        
        // Skip if has validation errors
        if (validationErrors.some((error) => error.row === rowNum)) {
          skipped.push({
            row: rowNum,
            reason: "Validation errors",
            title: record.title,
            course_type: record.course_type,
          });
          return false;
        }
        
        // Skip if duplicate (keep first occurrence only)
        // A course is only a duplicate if it has the same title AND the same course_type
        if (record.title && record.course_type) {
          const titleLower = record.title.toLowerCase().trim();
          const courseTypeLower = record.course_type.toLowerCase().trim();
          const compositeKey = `${titleLower}::${courseTypeLower}`;
          
          if (seenCombinations.has(compositeKey)) {
            const firstRow = seenCombinations.get(compositeKey);
            skipped.push({
              row: rowNum,
              reason: `Duplicate course: "${record.title}" with course type "${record.course_type}" (first occurrence at row ${firstRow})`,
              title: record.title,
              course_type: record.course_type,
            });
            return false;
          }
          
          // Mark as seen
          seenCombinations.set(compositeKey, rowNum);
        } else {
          // If title or course_type is missing, skip it (should be caught by validation)
          skipped.push({
            row: rowNum,
            reason: "Missing required fields (title or course_type)",
            title: record.title,
            course_type: record.course_type,
          });
          return false;
        }
        
        return true;
      }).length;
      
      return { validRecordsCount: validCount, calculatedSkippedRecords: skipped };
    }
  }, [parsedData, validationErrors, uploadType]);

  // Update skipped records state when calculated
  useEffect(() => {
    setSkippedRecords(calculatedSkippedRecords);
  }, [calculatedSkippedRecords]);
  
  const errorRecordsCount = validationErrors.length;
  const canUpload = parsedData.length > 0 && validRecordsCount > 0;

  if (!isOpen) return null;

  // Show selection dialog if upload type is not selected
  if (!uploadType) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4 font-sans">
        <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md">
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Select Upload Type</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Please select the type of courses you are uploading:
            </p>

            <button
              onClick={() => handleUploadTypeSelect("old")}
              className="w-full p-4 text-left border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <div className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                Old Courses
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Upload courses with Old Course ID mapping. Required fields: oldId (_id), title, duration
              </div>
            </button>

            <button
              onClick={() => handleUploadTypeSelect("new")}
              className="w-full p-4 text-left border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
            >
              <div className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                New Courses
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Upload new courses. Required fields: title, duration, course_type
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4 font-sans">
      <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Bulk Upload {uploadType === "old" ? "Old" : "New"} Courses
            </h2>
            <button
              onClick={handleBackToSelection}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mt-1"
            >
              ← Change upload type
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="mt-6 flex flex-col h-full overflow-y-auto pr-2 custom-scroll">
          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                className="flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-colors bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800"
              >
                <Upload size={18} />
                Choose File
              </label>
              {selectedFile && (
                <span className="text-sm text-gray-600 dark:text-gray-300">{selectedFile.name}</span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Supported formats: CSV (.csv) or Excel (.xlsx, .xls)
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {uploadType === "old" 
                ? "Required columns: oldId (or _id), title, duration. Optional: old_price, new_price, course_type"
                : "Required columns: title, duration, course_type. Optional: old_price, new_price"}
            </p>
          </div>

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <p className="text-sm text-blue-700 dark:text-blue-300">Processing file...</p>
            </div>
          )}

          {/* Summary */}
          {parsedData.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Upload Summary</h3>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600 dark:text-green-400">
                    Valid: {validRecordsCount} record(s)
                  </span>
                  {errorRecordsCount > 0 && (
                    <span className="text-red-600 dark:text-red-400">
                      Errors: {errorRecordsCount} record(s)
                    </span>
                  )}
                  {duplicateRecords.length > 0 && (
                    <span className="text-amber-600 dark:text-amber-400">
                      Duplicates: {duplicateRecords.length} record(s)
                    </span>
                  )}
                  {skippedRecords.length > 0 && (
                    <span className="text-orange-600 dark:text-orange-400">
                      Skipped: {skippedRecords.length} record(s)
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Upload Results */}
          {uploadResult && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Upload Results</h3>
              <div className="flex gap-4 text-sm mb-2">
                {uploadResult.total !== undefined && (
                  <span className="text-gray-700 dark:text-gray-300">Total: {uploadResult.total}</span>
                )}
                {uploadResult.success !== undefined && (
                  <span className="text-green-600 dark:text-green-400">
                    Success: {uploadResult.success}
                  </span>
                )}
                {uploadResult.failed !== undefined && (
                  <span className="text-red-600 dark:text-red-400">Failed: {uploadResult.failed}</span>
                )}
                {uploadResult.skipped !== undefined && (
                  <span className="text-amber-600 dark:text-amber-400">
                    Skipped: {uploadResult.skipped}
                  </span>
                )}
              </div>

              {uploadResult.errors && uploadResult.errors.length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowFailedRecords(!showFailedRecords)}
                    className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline mb-2"
                  >
                    {showFailedRecords ? "Hide Errors" : "Show Errors"}
                  </button>
                  {showFailedRecords && (
                    <div className="max-h-60 overflow-y-auto border border-red-200 dark:border-red-800 rounded bg-white dark:bg-gray-800">
                      <table className="min-w-full text-sm">
                        <thead className="bg-red-100 dark:bg-red-900/40 sticky top-0">
                          <tr>
                            <th className="p-2 text-left border border-red-200 dark:border-red-800 text-gray-700 dark:text-gray-300">Row #</th>
                            <th className="p-2 text-left border border-red-200 dark:border-red-800 text-gray-700 dark:text-gray-300">Error Message</th>
                          </tr>
                        </thead>
                        <tbody>
                          {uploadResult.errors.map((error: any, index: number) => (
                            <tr key={index} className="hover:bg-red-50 dark:hover:bg-red-900/20">
                              <td className="p-2 border border-red-200 dark:border-red-800 font-medium text-gray-700 dark:text-gray-300">
                                {error.row}
                              </td>
                              <td className="p-2 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
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
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-amber-600 dark:text-amber-400" size={18} />
                <h3 className="font-semibold text-amber-800 dark:text-amber-300">
                  Duplicate Records Found ({duplicateRecords.length} row(s))
                </h3>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300 mb-2">
                The following records have duplicates. Only the first occurrence will be uploaded:
              </p>
              <div className="max-h-40 overflow-y-auto">
                {duplicateRecords.slice(0, 10).map((dup, index) => (
                  <div key={index} className="text-sm text-amber-700 dark:text-amber-300 mb-1">
                    Row {dup.row}: {uploadType === "old" ? `Course ID "${dup.oldId}"` : `Title "${dup.title}" (Course Type: ${dup.course_type})`} (duplicate - will be ignored)
                  </div>
                ))}
                {duplicateRecords.length > 10 && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                    ... and {duplicateRecords.length - 10} more duplicate(s)
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="text-red-600 dark:text-red-400" size={18} />
                <h3 className="font-semibold text-red-800 dark:text-red-300">
                  Validation Errors ({validationErrors.length} row(s))
                </h3>
              </div>
              <div className="max-h-40 overflow-y-auto">
                {validationErrors.slice(0, 10).map((error, index) => (
                  <div key={index} className="text-sm text-red-700 dark:text-red-300 mb-1">
                    Row {error.row}: {error.errors.join(", ")}
                  </div>
                ))}
                {validationErrors.length > 10 && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                    ... and {validationErrors.length - 10} more error(s)
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Skipped Records */}
          {skippedRecords.length > 0 && (
            <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-md border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="text-orange-600 dark:text-orange-400" size={18} />
                  <h3 className="font-semibold text-orange-800 dark:text-orange-300">
                    Skipped Records ({skippedRecords.length} row(s))
                  </h3>
                </div>
                <button
                  onClick={() => setShowSkippedRecords(!showSkippedRecords)}
                  className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 underline"
                >
                  {showSkippedRecords ? "Hide Details" : "Show Details"}
                </button>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300 mb-2">
                The following records will be skipped and not uploaded:
              </p>
              {showSkippedRecords && (
                <div className="max-h-60 overflow-y-auto border border-orange-200 dark:border-orange-800 rounded bg-white dark:bg-gray-800 mt-2">
                  <table className="min-w-full text-sm">
                    <thead className="bg-orange-100 dark:bg-orange-900/40 sticky top-0">
                      <tr>
                        <th className="p-2 text-left border border-orange-200 dark:border-orange-800 text-gray-700 dark:text-gray-300">Row #</th>
                        <th className="p-2 text-left border border-orange-200 dark:border-orange-800 text-gray-700 dark:text-gray-300">
                          {uploadType === "old" ? "Course ID" : "Title"}
                        </th>
                        {uploadType === "new" && (
                          <th className="p-2 text-left border border-orange-200 dark:border-orange-800 text-gray-700 dark:text-gray-300">Course Type</th>
                        )}
                        <th className="p-2 text-left border border-orange-200 dark:border-orange-800 text-gray-700 dark:text-gray-300">Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      {skippedRecords.map((skipped, index) => (
                        <tr key={index} className="hover:bg-orange-50 dark:hover:bg-orange-900/20">
                          <td className="p-2 border border-orange-200 dark:border-orange-800 font-medium text-gray-700 dark:text-gray-300">
                            {skipped.row}
                          </td>
                          <td className="p-2 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400">
                            {uploadType === "old" ? skipped.oldId || "-" : skipped.title || "-"}
                          </td>
                          {uploadType === "new" && (
                            <td className="p-2 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400">
                              {skipped.course_type || "-"}
                            </td>
                          )}
                          <td className="p-2 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400">
                            {skipped.reason}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {!showSkippedRecords && (
                <div className="max-h-40 overflow-y-auto">
                  {skippedRecords.slice(0, 10).map((skipped, index) => (
                    <div key={index} className="text-sm text-orange-700 dark:text-orange-300 mb-1">
                      Row {skipped.row}: {skipped.reason}
                    </div>
                  ))}
                  {skippedRecords.length > 10 && (
                    <p className="text-sm text-orange-600 dark:text-orange-400 mt-2">
                      ... and {skippedRecords.length - 10} more skipped record(s)
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Preview Table */}
          {parsedData.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  Preview ({previewRows >= parsedData.length ? "All" : "First"} {Math.min(previewRows, parsedData.length)} {previewRows >= parsedData.length ? "" : "rows"})
                </h3>
                <select
                  value={previewRows >= parsedData.length ? parsedData.length : previewRows}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "all") {
                      setPreviewRows(parsedData.length);
                    } else {
                      setPreviewRows(Number(value));
                    }
                  }}
                  className="text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                  <option value={10}>10 rows</option>
                  <option value={20}>20 rows</option>
                  <option value={50}>50 rows</option>
                  {parsedData.length > 50 && (
                    <option value="all">Show All ({parsedData.length} rows)</option>
                  )}
                </select>
              </div>
              <div className="overflow-x-auto max-h-96 border border-gray-300 dark:border-gray-700 rounded">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
                    <tr>
                      <th className="p-2 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">#</th>
                      {uploadType === "old" ? (
                        <>
                          <th className="p-2 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Old Course ID</th>
                          <th className="p-2 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Title</th>
                          <th className="p-2 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Duration (months)</th>
                          <th className="p-2 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Old Price</th>
                          <th className="p-2 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">New Price</th>
                          <th className="p-2 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Course Type</th>
                        </>
                      ) : (
                        <>
                          <th className="p-2 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Title</th>
                          <th className="p-2 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Duration (months)</th>
                          <th className="p-2 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Course Type</th>
                          <th className="p-2 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Old Price</th>
                          <th className="p-2 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">New Price</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.slice(0, previewRows).map((record, index) => {
                      // rowNum should be the actual row number in the file (1-based)
                      // index is the position in the sliced array, so we add 1 to get the actual row number
                      const rowNum = index + 1;
                      const hasError = validationErrors.some(
                        (e) => e.row === rowNum
                      );
                      const isDuplicate = duplicateRecords.some(
                        (d) => d.row === rowNum
                      );
                      const isSkipped = skippedRecords.some(
                        (s) => s.row === rowNum
                      );
                      const skippedReason = skippedRecords.find(
                        (s) => s.row === rowNum
                      )?.reason;
                      // Use a unique key based on the actual row number and record data to prevent React re-rendering issues
                      const uniqueKey = uploadType === "old" 
                        ? `row-${rowNum}-${(record as BulkUploadCourseRecord).oldId || index}`
                        : `row-${rowNum}-${(record as BulkUploadRegularCourseRecord).title || index}-${(record as BulkUploadRegularCourseRecord).course_type || ''}`;
                      return (
                        <tr
                          key={uniqueKey}
                          className={`${
                            hasError
                              ? "bg-red-50 dark:bg-red-900/20"
                              : isSkipped
                              ? "bg-orange-50 dark:bg-orange-900/20"
                              : isDuplicate
                              ? "bg-amber-50 dark:bg-amber-900/20"
                              : ""
                          }`}
                          title={isSkipped ? `Skipped: ${skippedReason}` : undefined}
                        >
                          <td className="p-2 border border-gray-300 dark:border-gray-700 font-medium text-gray-600 dark:text-gray-300">
                            {rowNum}
                            {isSkipped && (
                              <span className="ml-2 text-xs text-orange-600 dark:text-orange-400">(Skipped)</span>
                            )}
                          </td>
                          {uploadType === "old" ? (
                            <>
                              <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">{(record as BulkUploadCourseRecord).oldId || "-"}</td>
                              <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">{(record as BulkUploadCourseRecord).title || "-"}</td>
                              <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                                {(record as BulkUploadCourseRecord).duration || "-"} month(s)
                              </td>
                              <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                                {(record as BulkUploadCourseRecord).old_price !== undefined 
                                  ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format((record as BulkUploadCourseRecord).old_price!)
                                  : "-"}
                              </td>
                              <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                                {(record as BulkUploadCourseRecord).new_price !== undefined 
                                  ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format((record as BulkUploadCourseRecord).new_price!)
                                  : "-"}
                              </td>
                              <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                                {(record as BulkUploadCourseRecord).course_type || "-"}
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">{(record as BulkUploadRegularCourseRecord).title || "-"}</td>
                              <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                                {(record as BulkUploadRegularCourseRecord).duration || "-"} month(s)
                              </td>
                              <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">{(record as BulkUploadRegularCourseRecord).course_type || "-"}</td>
                              <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                                {(record as BulkUploadRegularCourseRecord).old_price !== undefined 
                                  ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format((record as BulkUploadRegularCourseRecord).old_price!)
                                  : "-"}
                              </td>
                              <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                                {(record as BulkUploadRegularCourseRecord).new_price !== undefined 
                                  ? new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format((record as BulkUploadRegularCourseRecord).new_price!)
                                  : "-"}
                              </td>
                            </>
                          )}
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
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800">
          <button
            type="button"
            onClick={() => {
              if (!isUploading) {
                handleReset();
                onClose();
              }
            }}
            disabled={isUploading}
            className={`px-6 py-2 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-md transition-colors ${
              isUploading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            Cancel
          </button>
          {parsedData.length > 0 && !isUploading && (
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-2 text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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
                ? "text-white bg-add-button dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-800"
                : "bg-gray-400 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
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
