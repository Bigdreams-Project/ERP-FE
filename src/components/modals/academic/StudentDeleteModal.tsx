"use client";
import { Student } from "@/types/academic/student.interface";
import { X, AlertTriangle, Archive, Trash2 } from "lucide-react";
import React, { useState } from "react";

interface StudentDeleteModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onSoftDelete: (studentId: string) => Promise<void>;
  onHardDelete: (studentId: string) => Promise<void>;
}

type DeleteType = "soft" | "hard" | null;

const StudentDeleteModal: React.FC<StudentDeleteModalProps> = ({
  student,
  isOpen,
  onClose,
  onSoftDelete,
  onHardDelete,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [deleteType, setDeleteType] = useState<DeleteType>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const isTestEmail = (email: string) => {
    const testPatterns = [
      /test@example\.com/i,
      /er@gmail\.com/i,
      /^test/i,
      /test$/i,
    ];
    return testPatterns.some((pattern) => pattern.test(email));
  };

  const handleTypeSelection = (type: "soft" | "hard") => {
    setDeleteType(type);
    setStep(2);
  };

  const handleConfirm = async () => {
    if (!deleteType || !student.id) return;

    setIsDeleting(true);
    try {
      if (deleteType === "soft") {
        await onSoftDelete(student.id);
      } else {
        await onHardDelete(student.id);
      }
      handleClose();
    } catch (error) {
      console.error("Failed to delete student:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setDeleteType(null);
    setIsDeleting(false);
    onClose();
  };

  const hasFinancialActivity =
    student.payments && student.payments.length > 0;
  const hasEnrollments =
    student.courses && student.courses.length > 0;
  const isTest = isTestEmail(student.email);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-start justify-center z-50 p-4 pt-44 font-sans">
      <div className="relative bg-white px-6 pt-6 rounded-xl shadow-xl w-1/2 max-w-2xl max-h-[95vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {step === 1 ? "Delete Student" : "Confirm Deletion"}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            aria-label="Close modal"
            disabled={isDeleting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="py-6">
          {step === 1 ? (
            // Step 1: Choose delete type
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-blue-600 mt-0.5" size={20} />
                  <div>
                    <p className="font-semibold text-blue-900 mb-1">
                      Student Information
                    </p>
                    <p className="text-sm text-blue-800">
                      <strong>Name:</strong> {student.fullName}
                    </p>
                    <p className="text-sm text-blue-800">
                      <strong>Email:</strong> {student.email}
                    </p>
                    <p className="text-sm text-blue-800">
                      <strong>Student ID:</strong> {student.studentId || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-gray-700 mb-4">
                  Choose how you want to delete this student:
                </p>

                <div className="space-y-3">
                  {/* Soft Delete Option */}
                  <button
                    onClick={() => handleTypeSelection("soft")}
                    className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Archive className="text-blue-600 mt-1" size={24} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Archive (Soft Delete)
                        </h3>
                        <p className="text-sm text-gray-600">
                          Mark the student as deleted but retain all records.
                          This preserves financial, academic, and audit data.
                          The student will be hidden from active views.
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Hard Delete Option */}
                  <button
                    onClick={() => handleTypeSelection("hard")}
                    className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Trash2 className="text-red-600 mt-1" size={24} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          Permanently Remove (Hard Delete)
                        </h3>
                        <p className="text-sm text-gray-600">
                          Permanently delete the student record. This action
                          cannot be undone. Only use for confirmed test data
                          with no financial or enrollment activity.
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Step 2: Confirmation
            <div className="space-y-6">
              {deleteType === "soft" ? (
                // Soft Delete Confirmation
                <div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <Archive className="text-blue-600 mt-0.5" size={20} />
                      <div>
                        <p className="font-semibold text-blue-900 mb-2">
                          Archive Student
                        </p>
                        <p className="text-sm text-blue-800 mb-2">
                          You are about to archive <strong>{student.fullName}</strong>.
                        </p>
                        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                          <li>Student will be marked as deleted</li>
                          <li>All enrollments will be preserved</li>
                          <li>All payment records will be retained</li>
                          <li>All batch assignments will remain intact</li>
                          <li>Student will be hidden from active views</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Hard Delete Confirmation
                <div>
                  <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="text-red-600 mt-0.5" size={20} />
                      <div>
                        <p className="font-semibold text-red-900 mb-2">
                          ⚠️ Permanent Deletion Warning
                        </p>
                        <p className="text-sm text-red-800 mb-2">
                          You are about to <strong>permanently delete</strong>{" "}
                          <strong>{student.fullName}</strong>. This action
                          cannot be undone.
                        </p>
                        {hasFinancialActivity && (
                          <div className="bg-red-100 border border-red-300 rounded p-2 mt-2">
                            <p className="text-sm font-semibold text-red-900">
                              ⚠️ This student has payment records. Hard delete
                              is not recommended.
                            </p>
                          </div>
                        )}
                        {hasEnrollments && (
                          <div className="bg-red-100 border border-red-300 rounded p-2 mt-2">
                            <p className="text-sm font-semibold text-red-900">
                              ⚠️ This student has course enrollments. Hard delete
                              is not recommended.
                            </p>
                          </div>
                        )}
                        {isTest && (
                          <div className="bg-yellow-100 border border-yellow-300 rounded p-2 mt-2">
                            <p className="text-sm text-yellow-900">
                              ℹ️ This appears to be a test account (
                              {student.email}).
                            </p>
                          </div>
                        )}
                        {!isTest && !hasFinancialActivity && !hasEnrollments && (
                          <p className="text-sm text-red-800 mt-2">
                            This student has no financial activity or
                            enrollments. Hard delete may be appropriate for test
                            data.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Student:</strong> {student.fullName}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Email:</strong> {student.email}
                </p>
                {student.studentId && (
                  <p className="text-sm text-gray-700">
                    <strong>Student ID:</strong> {student.studentId}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-4 pb-2">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={step === 1 ? handleClose : () => setStep(1)}
              className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              disabled={isDeleting}
            >
              {step === 1 ? "Cancel" : "Back"}
            </button>
            {step === 2 && (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isDeleting}
                className={`flex-1 px-6 py-2 text-white font-medium rounded-lg transition-colors ${
                  deleteType === "hard"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isDeleting
                  ? "Processing..."
                  : deleteType === "hard"
                  ? "Delete Permanently"
                  : "Archive Student"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDeleteModal;

