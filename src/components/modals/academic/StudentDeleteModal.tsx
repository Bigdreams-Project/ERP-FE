"use client";
import { Student } from "@/types/academic/student.interface";
import { X, AlertTriangle, Trash2 } from "lucide-react";
import React, { useState } from "react";

interface StudentDeleteModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onHardDelete: (studentId: string) => Promise<void>;
}

const StudentDeleteModal: React.FC<StudentDeleteModalProps> = ({
  student,
  isOpen,
  onClose,
  onHardDelete,
}) => {
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

  const handleConfirm = async () => {
    if (!student.id) return;

    setIsDeleting(true);
    try {
      await onHardDelete(student.id);
      // Don't close modal here - let parent handle closing after toast is shown
      // Parent will close modal after operation completes
    } catch (error) {
      console.error("Failed to delete student:", error);
      setIsDeleting(false);
    }
    // Note: isDeleting will be reset by parent when modal closes
  };

  const handleClose = () => {
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
          <h2 className="text-xl font-bold text-gray-800">Delete Student</h2>
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
          <div className="space-y-6">
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
                  <p className="text-sm text-red-800 mb-2">
                    <strong>Note:</strong> To archive this student instead, use the "Archive" option from the student actions menu.
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
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-4 pb-2">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isDeleting}
              className={`flex-1 px-6 py-2 text-white font-medium rounded-lg transition-colors bg-red-600 hover:bg-red-700 ${
                isDeleting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isDeleting ? "Deleting Permanently..." : "Delete Permanently"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDeleteModal;

