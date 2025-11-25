"use client";
import { ArchiveRecord } from "@/types/academic/archive.interface";
import { X, RotateCcw, AlertTriangle } from "lucide-react";
import React, { useState } from "react";

interface ArchiveRestoreConfirmModalProps {
  archiveRecord: ArchiveRecord;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (archiveId: string) => Promise<void>;
}

const ArchiveRestoreConfirmModal: React.FC<ArchiveRestoreConfirmModalProps> = ({
  archiveRecord,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [isRestoring, setIsRestoring] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!archiveRecord.id) return;

    setIsRestoring(true);
    try {
      await onConfirm(archiveRecord.id);
      handleClose();
    } catch (error) {
      console.error("Failed to restore student:", error);
    } finally {
      setIsRestoring(false);
    }
  };

  const handleClose = () => {
    setIsRestoring(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4 font-sans">
      <div className="relative bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Restore Student</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            aria-label="Close modal"
            disabled={isRestoring}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="py-6 flex flex-col h-full overflow-y-auto pr-2 custom-scroll">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <RotateCcw className="text-blue-600 mt-0.5" size={20} />
              <div>
                <p className="font-semibold text-blue-900 mb-2">
                  Move Student from Archive to Student Records
                </p>
                <p className="text-sm text-blue-800 mb-2">
                  You are about to restore <strong>{archiveRecord.fullname}</strong> from Archive back to Student records.
                </p>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Student will be moved back to Student table</li>
                  <li>Archive record will be removed</li>
                  <li>Student will appear in active Student list</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Student Name:</strong> {archiveRecord.fullname}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Email:</strong> {archiveRecord.email}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Phone:</strong> {archiveRecord.phone}
            </p>
            {archiveRecord.oldStudentId && (
              <p className="text-sm text-gray-700">
                <strong>Old Student ID:</strong> {archiveRecord.oldStudentId}
              </p>
            )}
            {archiveRecord.newStudentId && (
              <p className="text-sm text-gray-700">
                <strong>New Student ID:</strong> {archiveRecord.newStudentId}
              </p>
            )}
            <p className="text-sm text-gray-700">
              <strong>Course Enrolled:</strong> {archiveRecord.courseEnrolled}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-4 pb-2 sticky bottom-0 bg-white">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              disabled={isRestoring}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isRestoring}
              className={`flex-1 px-6 py-2 text-white font-medium rounded-lg transition-colors bg-blue-600 hover:bg-blue-700 ${
                isRestoring ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isRestoring ? "Restoring..." : "Restore Student"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchiveRestoreConfirmModal;

