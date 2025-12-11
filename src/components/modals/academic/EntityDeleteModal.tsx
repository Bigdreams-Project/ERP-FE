"use client";
import { AlertTriangle, Trash2, X } from "lucide-react";
import React, { useState } from "react";

interface EntityDeleteModalProps {
  entityType: "Lead" | "Center" | "Course" | "Batch";
  entity: {
    id: string;
    name?: string;
    fullName?: string;
    code?: string;
    email?: string;
    [key: string]: any;
  };
  isOpen: boolean;
  onClose: () => void;
  onHardDelete: (entityId: string) => Promise<void>;
  hasRelatedData?: {
    students?: number;
    enrollments?: number;
    payments?: number;
    batches?: number;
    leads?: number;
  };
}

const EntityDeleteModal: React.FC<EntityDeleteModalProps> = ({
  entityType,
  entity,
  isOpen,
  onClose,
  onHardDelete,
  hasRelatedData = {},
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
    if (!entity.id) return;

    setIsDeleting(true);
    try {
      await onHardDelete(entity.id);
      // Don't close modal here - let parent handle closing after toast is shown
      // Parent will close modal after operation completes
    } catch (error) {
      console.error(`Failed to delete ${entityType}:`, error);
      setIsDeleting(false);
    }
    // Note: isDeleting will be reset by parent when modal closes
  };

  const handleClose = () => {
    setIsDeleting(false);
    onClose();
  };

  const entityName = entity.name || entity.fullName || entity.code || "Unknown";
  const entityEmail = entity.email;
  const hasFinancialActivity = (hasRelatedData.payments || 0) > 0;
  const hasEnrollments = (hasRelatedData.enrollments || 0) > 0;
  const hasStudents = (hasRelatedData.students || 0) > 0;
  const hasBatches = (hasRelatedData.batches || 0) > 0;
  const hasLeads = (hasRelatedData.leads || 0) > 0;
  const hasRelatedRecords = hasFinancialActivity || hasEnrollments || hasStudents || hasBatches || hasLeads;
  const isTest = entityEmail ? isTestEmail(entityEmail) : false;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-start justify-center z-50 p-4 pt-44 font-sans">
      <div className="relative bg-white px-6 pt-6 rounded-xl shadow-xl w-1/2 max-w-2xl max-h-[95vh] overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Delete {entityType}</h2>
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
                    <strong>{entityName}</strong>. This action
                    cannot be undone.
                  </p>
                  {hasRelatedRecords && (
                    <div className="bg-red-100 border border-red-300 rounded p-2 mt-2">
                      <p className="text-sm font-semibold text-red-900">
                        ⚠️ This {entityType.toLowerCase()} has related records. Hard delete
                        is not recommended.
                      </p>
                    </div>
                  )}
                  {isTest && entityEmail && (
                    <div className="bg-yellow-100 border border-yellow-300 rounded p-2 mt-2">
                      <p className="text-sm text-yellow-900">
                        ℹ️ This appears to be a test account ({entityEmail}).
                      </p>
                    </div>
                  )}
                  {!isTest && !hasRelatedRecords && (
                    <p className="text-sm text-red-800 mt-2">
                      This {entityType.toLowerCase()} has no related records. Hard delete may be appropriate for test
                      data.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <strong>{entityType}:</strong> {entityName}
              </p>
              {entity.code && (
                <p className="text-sm text-gray-700">
                  <strong>Code:</strong> {entity.code}
                </p>
              )}
              {entityEmail && (
                <p className="text-sm text-gray-700">
                  <strong>Email:</strong> {entityEmail}
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

export default EntityDeleteModal;

