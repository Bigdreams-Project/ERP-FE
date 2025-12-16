"use client";
import { Center } from "@/types/academic/center.interface";
import {
  BulkUploadStudentsRequest,
  BulkUploadStudentRecord,
  BulkUploadStudentsResponse,
} from "@/types/requests/student.interface";
import * as XLSX from "xlsx";
import { X, Upload, AlertCircle, ChevronDown } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useIsAdmin } from "@/hooks/useIsAdmin";

interface BulkUploadStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: BulkUploadStudentsRequest
  ) => Promise<BulkUploadStudentsResponse>;
  centers: Center[];
  isUploading?: boolean;
}

const BulkUploadStudentsModal: React.FC<BulkUploadStudentsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  centers,
  isUploading = false,
}) => {
  const { isAdmin } = useIsAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCenterId, setSelectedCenterId] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<BulkUploadStudentRecord[]>([]);
  const [validationErrors, setValidationErrors] = useState<
    Array<{ row: number; errors: string[] }>
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewRows, setPreviewRows] = useState(10);
  const [duplicateRecords, setDuplicateRecords] = useState<
    Array<{ row: number; oldId: string }>
  >([]);
  const [uploadResult, setUploadResult] =
    useState<BulkUploadStudentsResponse | null>(null);
  const [showFailedRecords, setShowFailedRecords] = useState(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      handleReset();
    }
  }, [isOpen]);

  /**
   * Format date from Excel - handles multiple formats:
   * - "2011-08-22" (YYYY-MM-DD string)
   * - Excel serial numbers
   * - Other date formats
   */
  const formatDate = (dateValue: any): string => {
    if (!dateValue) return "";

    // Handle Excel date serial numbers
    if (typeof dateValue === "number") {
      const excelEpoch = new Date(1899, 11, 30);
      const date = new Date(excelEpoch.getTime() + dateValue * 86400000);
      return date.toISOString().split("T")[0];
    }

    // Handle string dates
    if (typeof dateValue === "string") {
      const trimmed = dateValue.trim();

      // Handle YYYY-MM-DD format (e.g., "2011-08-22")
      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        const date = new Date(trimmed);
        if (!isNaN(date.getTime())) {
          return trimmed;
        }
      }

      // Handle other date formats
      const date = new Date(trimmed);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0];
      }
    }

    return "";
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Require center selection before file upload
    if (!selectedCenterId) {
      alert("Please select a center first before uploading a file.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

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
        const recordErrors: string[] = [];
        if (!record.oldId) recordErrors.push("Old Student ID is required");
        if (!record.fullName) recordErrors.push("Full Name is required");
        if (!record.email) recordErrors.push("Email is required");
        if (!record.phone) recordErrors.push("Phone is required");
        if (!record.address) recordErrors.push("Address is required");
        if (!record.birthDate) recordErrors.push("Birth Date is required");
        if (!record.enrolledDate) recordErrors.push("Enrollment Date is required");
        if (!record.courseId) recordErrors.push("Course ID is required");
        if (record.courseFee === undefined || record.courseFee < 0)
          recordErrors.push("Course Fee must be >= 0");
        if (!record.payments || record.payments.length === 0)
          recordErrors.push("At least one payment is required");
        record.payments?.forEach((payment, pIndex) => {
          if (payment.amount === undefined || payment.amount < 0)
            recordErrors.push(`Payment ${pIndex + 1} Amount must be >= 0`);
          if (!payment.date)
            recordErrors.push(`Payment ${pIndex + 1} Date is required`);
          if (payment.balance === undefined || payment.balance < 0)
            recordErrors.push(`Payment ${pIndex + 1} Balance must be >= 0`);
        });
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
      alert(`Failed to parse file: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const readExcelFile = (file: File): Promise<BulkUploadStudentRecord[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          // Map Excel columns to BulkUploadStudentRecord fields
          const mappedData: BulkUploadStudentRecord[] = jsonData.map(
            (row: any, index: number) => {
              // Helper to map field with variations
              const mapField = (excelName: string, variations: string[]) => {
                const lowerRow = Object.keys(row).reduce((acc, key) => {
                  acc[key.toLowerCase().trim()] = row[key];
                  return acc;
                }, {} as any);

                for (const variation of variations) {
                  const lowerVar = variation.toLowerCase().trim();
                  const value = lowerRow[lowerVar];
                  if (value !== undefined && value !== null && value !== "") {
                    if (typeof value === "number") {
                      return String(value);
                    }
                    return String(value).trim();
                  }
                }
                return null;
              };

              // Helper to parse numeric values
              const parseNumericField = (variations: string[]): number => {
                const lowerRow = Object.keys(row).reduce((acc, key) => {
                  acc[key.toLowerCase().trim()] = row[key];
                  return acc;
                }, {} as any);

                for (const variation of variations) {
                  const lowerVar = variation.toLowerCase().trim();
                  const value = lowerRow[lowerVar];
                  if (value !== undefined && value !== null && value !== "") {
                    if (typeof value === "number") {
                      return isNaN(value) ? 0 : value;
                    }
                    const cleaned = String(value)
                      .replace(/[₦$€£¥,\s]/g, "")
                      .trim();
                    const parsed = parseFloat(cleaned);
                    return isNaN(parsed) ? 0 : parsed;
                  }
                }
                return 0;
              };

              // Extract payment installments
              const payments: Array<{
                amount: number;
                date: string;
                balance: number;
              }> = [];
              let paymentIndex = 1;

              while (
                row[`Payment ${paymentIndex} Amount`] !== undefined ||
                row[`payment ${paymentIndex} amount`] !== undefined ||
                row[`Payment ${paymentIndex} Date`] !== undefined ||
                row[`payment ${paymentIndex} date`] !== undefined
              ) {
                const amount = parseNumericField([
                  `Payment ${paymentIndex} Amount`,
                  `payment ${paymentIndex} amount`,
                  `Payment ${paymentIndex} amount`,
                ]);
                const date = formatDate(
                  mapField(`Payment ${paymentIndex} Date`, [
                    `Payment ${paymentIndex} Date`,
                    `payment ${paymentIndex} date`,
                    `Payment ${paymentIndex} date`,
                  ])
                );
                const balance = parseNumericField([
                  `Payment ${paymentIndex} Balance`,
                  `payment ${paymentIndex} balance`,
                  `Payment ${paymentIndex} balance`,
                ]);

                // Only add payment if at least amount or date is present
                if (amount > 0 || date) {
                  payments.push({
                    amount: amount || 0,
                    date: date || "",
                    balance: balance || 0,
                  });
                }
                paymentIndex++;
              }

              return {
                oldId:
                  mapField("oldId", [
                    "old student id",
                    "oldstudentid",
                    "old_student_id",
                    "student old id",
                    "student id",
                    "studentid",
                  ]) || "",
                fullName:
                  mapField("fullName", [
                    "full name",
                    "fullname",
                    "name",
                    "student name",
                  ]) || "",
                email: mapField("email", ["email", "e-mail"]) || "",
                phone: mapField("phone", [
                  "phone",
                  "phone number",
                  "mobile",
                  "contact",
                ]) || "",
                address: mapField("address", ["address"]) || "",
                birthDate: formatDate(
                  mapField("birthDate", [
                    "birth date",
                    "birthdate",
                    "dob",
                    "date of birth",
                    "birth_date",
                  ])
                ),
                enrolledDate: formatDate(
                  mapField("enrolledDate", [
                    "enrollment date",
                    "enrollmentdate",
                    "enrolled date",
                    "enroll_date",
                    "enrollment_date",
                  ])
                ),
                courseId:
                  mapField("courseId", [
                    "course id",
                    "courseid",
                    "course_id",
                    "course",
                  ]) || "",
                courseFee: parseNumericField([
                  "course fee",
                  "coursefee",
                  "course_fee",
                  "fee",
                  "price",
                ]),
                payments: payments,
                guardianName: mapField("guardianName", [
                  "guardian name",
                  "guardianname",
                  "guardian_name",
                  "guardian",
                ]) || undefined,
                guardianEmail: mapField("guardianEmail", [
                  "guardian email",
                  "guardianemail",
                  "guardian_email",
                  "guardian e-mail",
                ]) || null,
                guardianPhone: mapField("guardianPhone", [
                  "guardian phone",
                  "guardianphone",
                  "guardian_phone",
                  "guardian phone number",
                  "guardianphone number",
                ]) || undefined,
                guardianAddress: mapField("guardianAddress", [
                  "guardian address",
                  "guardianaddress",
                  "guardian_address",
                ]) || undefined,
                price_type: mapField("price_type", [
                  "price type",
                  "pricetype",
                  "price_type",
                  "price-type",
                ]) || undefined,
              };
            }
          );

          resolve(mappedData);
        } catch (error: any) {
          reject(new Error(`Failed to parse Excel file: ${error.message}`));
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

    if (!selectedCenterId) {
      alert("Please select a center");
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
      const result = await onSave({
        centerId: selectedCenterId,
        records: validRecords,
      });
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
    setSelectedCenterId("");
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
  const canUpload =
    selectedCenterId && parsedData.length > 0 && validRecordsCount > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4 font-sans">
      <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Bulk Upload Students</h2>
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
          {/* Center Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Center *
            </label>
            <div className="relative">
              <select
                value={selectedCenterId}
                onChange={(e) => {
                  setSelectedCenterId(e.target.value);
                  if (selectedFile) {
                    handleReset();
                  }
                }}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors appearance-none"
                disabled={!isAdmin}
              >
                <option value="">Select Center</option>
                {centers.map((center) => (
                  <option key={center.id} value={center.id}>
                    {center.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                <ChevronDown size={18} />
              </span>
            </div>
            {!selectedCenterId && (
              <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                Please select a center before uploading a file
              </p>
            )}
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Upload Excel File *
            </label>
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
                id="students-file-input"
                disabled={!selectedCenterId}
              />
              <label
                htmlFor="students-file-input"
                className={`flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer transition-colors ${
                  selectedCenterId
                    ? "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800"
                    : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                }`}
              >
                <Upload size={18} />
                Choose File
              </label>
              {selectedFile && (
                <span className="text-sm text-gray-600 dark:text-gray-300">{selectedFile.name}</span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Supported formats: Excel (.xlsx, .xls)
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
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Center:{" "}
                {centers.find((c) => c.id === selectedCenterId)?.name ||
                  "Not selected"}
              </p>
            </div>
          )}

          {/* Upload Results */}
          {uploadResult && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Upload Results</h3>
              <div className="flex gap-4 text-sm mb-2">
                <span className="text-gray-700 dark:text-gray-300">Total: {uploadResult.total}</span>
                <span className="text-green-600 dark:text-green-400">
                  Success: {uploadResult.success}
                </span>
                <span className="text-red-600 dark:text-red-400">Failed: {uploadResult.failed}</span>
                <span className="text-amber-600 dark:text-amber-400">
                  Skipped: {uploadResult.skipped}
                </span>
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
                          {uploadResult.errors.map((error, index) => (
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
                The following records have duplicate Student IDs. Only the first
                occurrence will be uploaded:
              </p>
              <div className="max-h-40 overflow-y-auto">
                {duplicateRecords.slice(0, 10).map((dup, index) => (
                  <div key={index} className="text-sm text-amber-700 dark:text-amber-300 mb-1">
                    Row {dup.row}: Student ID "{dup.oldId}" (duplicate - will be
                    ignored)
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

          {/* Preview Table */}
          {parsedData.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                  Preview (First {Math.min(previewRows, parsedData.length)} rows)
                </h3>
                <select
                  value={previewRows}
                  onChange={(e) => setPreviewRows(Number(e.target.value))}
                  className="text-sm px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                >
                  <option value={10}>10 rows</option>
                  <option value={20}>20 rows</option>
                  <option value={50}>50 rows</option>
                </select>
              </div>
              <div className="overflow-x-auto max-h-96 border border-gray-300 dark:border-gray-700 rounded">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
                    <tr>
                      <th className="p-2 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">#</th>
                      <th className="p-2 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Old Student ID</th>
                      <th className="p-2 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Full Name</th>
                      <th className="p-2 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Email</th>
                      <th className="p-2 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Phone</th>
                      <th className="p-2 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Course ID</th>
                      <th className="p-2 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Guardian Name</th>
                      <th className="p-2 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Guardian Phone</th>
                      <th className="p-2 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Guardian Email</th>
                      <th className="p-2 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Price Type</th>
                      <th className="p-2 text-left border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">Payments</th>
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
                              ? "bg-red-50 dark:bg-red-900/20"
                              : isDuplicate
                              ? "bg-amber-50 dark:bg-amber-900/20"
                              : ""
                          }`}
                        >
                          <td className="p-2 border border-gray-300 dark:border-gray-700 font-medium text-gray-600 dark:text-gray-300">
                            {rowNum}
                          </td>
                          <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">{record.oldId || "-"}</td>
                          <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">{record.fullName || "-"}</td>
                          <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">{record.email || "-"}</td>
                          <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">{record.phone || "-"}</td>
                          <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">{record.courseId || "-"}</td>
                          <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">{record.guardianName || "-"}</td>
                          <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">{record.guardianPhone || "-"}</td>
                          <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">{record.guardianEmail || "-"}</td>
                          <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">{record.price_type || "-"}</td>
                          <td className="p-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                            {record.payments?.length || 0} payment(s)
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

export default BulkUploadStudentsModal;

