"use client";
import { Student } from "@/types/academic/student.interface";
import { X, Archive, AlertTriangle } from "lucide-react";
import React, { useState } from "react";

interface ArchiveStudentConfirmModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (studentId: string) => Promise<void>;
}

const ArchiveStudentConfirmModal: React.FC<ArchiveStudentConfirmModalProps> = ({
  student,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isArchiving, setIsArchiving] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!student.id) return;

    setIsArchiving(true);
    try {
      await onConfirm(student.id);
      // Don't close modal here - let parent handle closing after toast is shown
      // Parent will close modal after operation completes
    } catch (error) {
      console.error("Failed to archive student:", error);
      setIsArchiving(false);
    }
    // Note: isArchiving will be reset by parent when modal closes
  };

  const handleClose = () => {
    setIsArchiving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4 font-sans">
      <div className="relative bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Archive Student</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            aria-label="Close modal"
            disabled={isArchiving}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="py-6 flex flex-col h-full overflow-y-auto pr-2 custom-scroll">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <Archive className="text-amber-600 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-amber-900 mb-2">
                  Move Student to Archive
                </p>
                <p className="text-sm text-amber-800 mb-2">
                  You are about to move <strong>{student.fullName}</strong> from Student records to Archive.
                </p>
                <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                  <li>Student will be moved to Archive table</li>
                  <li>Student will be removed from active Student list</li>
                  <li>This action can be reversed by restoring from Archive</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Student Name:</strong> {student.fullName}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Email:</strong> {student.email}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Phone:</strong> {student.phone}
            </p>
            {student.studentId && (
              <p className="text-sm text-gray-700">
                <strong>Student ID:</strong> {student.studentId}
              </p>
            )}
            {student.center && (
              <p className="text-sm text-gray-700">
                <strong>Center:</strong> {student.center.name}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-4 pb-2 sticky bottom-0 bg-white">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              disabled={isArchiving}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isArchiving}
              className={`flex-1 px-6 py-2 text-white font-medium rounded-lg transition-colors bg-amber-600 hover:bg-amber-700 ${
                isArchiving ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isArchiving ? "Archiving..." : "Archive Student"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchiveStudentConfirmModal;

