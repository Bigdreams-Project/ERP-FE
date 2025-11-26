import { courseTypes, durationOptions } from "@/data/view/course.data";
import { ICourse, ICourseModalProps } from "@/types/academic/course.interface";
import { courseSchema } from "@/validations/academic/course.validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { BookOpen, ChevronDown, Clock, X } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const CourseModal: React.FC<ICourseModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  mode,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    watch,
    setValue,
    getValues,
  } = useForm<ICourse>({
    resolver: yupResolver(courseSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      type: "",
      duration: 1,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData);
      } else {
        reset({
          name: "",
          type: "",
          duration: 1,
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const handleSaveDraft = (data: ICourse | any) => {
    onSave(data, true);
    onClose();
  };

  const handleSave = (data: ICourse | any) => {
    onSave(data, false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4 font-sans">
      <div className="relative bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-800">
              {mode === "edit" ? "Edit Course" : "Create New Course"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form className="mt-2 flex flex-col h-full overflow-y-auto pr-2 custom-scroll">
          <div className="p-4 bg-white rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              {/* Course Name */}
              <div className="flex flex-col sm:col-span-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
                >
                  <BookOpen size={14} />
                  Course Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  placeholder="Title of Course Here"
                  className="w-full h-12 px-4 text-sm text-gray-600 rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Course Type */}
              <div className="flex flex-col relative">
                <label
                  htmlFor="type"
                  className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
                >
                  <BookOpen size={14} /> Course Type
                </label>
                <select
                  id="type"
                  {...register("type")}
                  className="w-full h-10 px-3 text-sm text-gray-600 rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors appearance-none"
                >
                  <option value="">Select Type</option>
                  {courseTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <ChevronDown size={18} />
                </span>
                {errors.type && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.type.message}
                  </p>
                )}
              </div>

              {/* Duration */}
              <div className="flex flex-col relative">
                <label
                  htmlFor="duration"
                  className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
                >
                  <Clock size={14} /> Duration (Months)
                </label>
                <select
                  id="duration"
                  {...register("duration", { valueAsNumber: true })}
                  className="w-full h-10 px-3 text-sm text-gray-600 rounded-lg bg-white border border-gray-300 focus:border-blue-500 focus:outline-none transition-colors appearance-none"
                >
                  {durationOptions.map((duration) => (
                    <option key={duration.value} value={duration.value}>
                      {duration.label}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <ChevronDown size={18} />
                </span>
                {errors.duration && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.duration.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto pt-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSaveDraft(getValues())}
              className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave(getValues())}
              className={`px-6 py-2 text-white font-medium rounded-lg transition-colors ${
                isValid
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-400 cursor-not-allowed opacity-70"
              }`}
              disabled={!isValid}
            >
              Publish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseModal;
