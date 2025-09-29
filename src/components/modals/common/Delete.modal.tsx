"use client";
import { IDeleteModalProps } from "@/types/academic/lead.interface";
import { X } from "lucide-react";
import React from "react";

const DeleteModal: React.FC<IDeleteModalProps> = ({
  title,
  subtitle,
  isOpen,
  onClose,
  onDelete,
}) => {
  if (!isOpen) return null;

  const handleDelete = (id: string | any) => {
    onDelete(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-start justify-center z-50 p-4 pt-44 font-sans">
      <div className="relative bg-white px-6 pt-6 rounded-xl shadow-xl w-1/3 max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Delete {title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="h-[95%] py-6 ">
          <p className="text-black font-medium text-center">{subtitle}</p>

          <div className="w-full mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className={`w-1/2 px-6 py-2 text-white font-medium bg-red-600 hover:bg-red-700 rounded-lg transition-colors `}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
