import {
  durationOptions,
  scheduleTimes,
  statuses,
} from "@/data/view/batch.data";
import { addHoursToTime } from "@/lib/utils";
import { useFieldArray } from "react-hook-form";
import {
  IBatch,
  IBatchModalProps,
  IBatchSchedule,
} from "@/types/academic/batch.interface";
import { batchSchema } from "@/validations/academic/batch.validation";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  BookOpen,
  Calendar,
  ChevronDown,
  Clock,
  User,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import Select, { ActionMeta, MultiValue } from "react-select";
import { ImSpinner2 } from "react-icons/im";
import { useTheme } from "@/context/ThemeContext";

const BatchModal: React.FC<IBatchModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  courses,
  students,
  faculties,
  mode,
  isLoading = false,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
    setValue,
    getValues,
    watch,
    trigger,
  } = useForm<IBatch>({
    resolver: yupResolver(batchSchema),
    mode: "all", // Validate on all events (change, blur, submit)
    defaultValues: {
      courseId: "",
      centerId: "",
      startDate: "",
      endDate: "",
      duration: "",
      schedules: [
        {
          day: "Monday",
          startTime: "",
          endTime: "",
          duration: 2,
        },
      ],
      facultyIds: [],
      students: [],
    },
  });

  const {
    fields: schedules,
    append: appendSchedule,
    remove: removeSchedule,
  } = useFieldArray({
    control,
    name: "schedules",
  });

  const [isDraft, setIsDraft] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [allCenters, setAllCenters] = useState<any[]>([]);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const courseId = watch("courseId");
  
  // Fetch centers to match center IDs with names
  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const { getCentersClient } = await import("@/lib/client-network");
        const centers = await getCentersClient();
        setAllCenters(centers || []);
      } catch (error) {
      }
    };
    if (isOpen) {
      fetchCenters();
    }
  }, [isOpen]);
  
  // Watch all form values for debugging and manual validation check
  const formValues = watch();

  
  // Manual validation check - ensure all required fields are filled
  const isFormValid = useMemo(() => {
    const hasRequiredFields = 
      formValues.courseId &&
      formValues.centerId &&
      formValues.startDate &&
      formValues.endDate &&
      formValues.duration &&
      formValues.schedules?.length > 0 &&
      formValues.schedules.every(
        (s: any) => s.day && s.startTime && s.endTime && s.duration
      ) &&
      formValues.facultyIds?.length > 0 &&
      formValues.students?.length > 0;
    
    // Only return true if both react-hook-form validation passes AND required fields are filled
    return isValid && hasRequiredFields && Object.keys(errors).length === 0;
  }, [isValid, formValues, errors]);

  useEffect(() => {
    if (courseId) {
      const foundCourse = courses.find((course) => course.id === courseId);
      if (foundCourse) {
        setSelectedCourse(foundCourse);
        const duration = parseInt(foundCourse.duration.toString(), 10).toString();
        setValue("duration", duration, { shouldValidate: true });
        
        // If course has only one assignment, auto-select it
        if (foundCourse.courseAssignments?.length === 1) {
          const centerId = foundCourse.courseAssignments[0].centerId;
          if (centerId) {
            setValue("centerId", centerId, { shouldValidate: true });
          }
        } else {
          // Multiple or no assignments - clear centerId and let user select
          setValue("centerId", "", { shouldValidate: true });
        }
        // Trigger validation for all fields to update isValid state
        trigger();
      }
    } else {
      setSelectedCourse(null);
      // Reset duration and centerId when course is cleared
      setValue("duration", "", { shouldValidate: true });
      setValue("centerId", "", { shouldValidate: true });
      trigger();
    }
  }, [courseId, setValue, courses, trigger]);

  // Reset the form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset(initialData);
        // Set selectedCourse for edit mode
        if (initialData.courseId) {
          const foundCourse = courses.find((course) => course.id === initialData.courseId);
          if (foundCourse) {
            setSelectedCourse(foundCourse);
          }
        }
      } else {
        reset({
          courseId: "",
          centerId: "",
          startDate: "",
          endDate: "",
          schedules: [
            {
              day: "Monday",
              startTime: "",
              endTime: "",
              duration: 2,
            },
          ],
          facultyIds: [],
          students: [],
        });
        setSelectedCourse(null);
      }
    }
  }, [isOpen, initialData, reset, courses]);

  const studentOptions = students.map((student) => ({
    value: student.id,
    label: student.fullName,
  }));

  const facultyOptions = faculties?.map((faculty) => ({
    value: faculty.id!,
    label: faculty.fullname,
  })) || [];

  const handleChange = (
    selectedOptions: MultiValue<{ value: string; label: string }>,
    _actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    setSelectedStudents(
      selectedOptions ? selectedOptions.map((option) => option.label) : []
    );
  };

  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: isDarkMode ? "#374151" : "#f3f4f6",
      borderColor: "transparent",
      boxShadow: "none",
      "&:hover": {
        borderColor: "transparent",
      },
      minHeight: "40px",
      borderRadius: "8px",
      paddingLeft: "0.75rem",
      transition: "border-color 150ms ease-in-out",
      "&:focus-within": {
        borderColor: isDarkMode ? "#60a5fa" : "#3b82f6",
      },
    }),
    input: (provided: any) => ({
      ...provided,
      color: isDarkMode ? "#f3f4f6" : "#1f2937",
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: isDarkMode ? "#1e3a8a" : "#dbeafe",
      borderRadius: "9999px",
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: isDarkMode ? "#93c5fd" : "#1e40af",
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: isDarkMode ? "#93c5fd" : "#1e40af",
      "&:hover": {
        backgroundColor: isDarkMode ? "#1e40af" : "#bfdbfe",
        color: isDarkMode ? "#ffffff" : "#1e40af",
      },
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: isDarkMode ? "#9ca3af" : "#9ca3af",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused 
        ? (isDarkMode ? "#4b5563" : "#e5e7eb")
        : (isDarkMode ? "#374151" : "white"),
      color: isDarkMode ? "#f3f4f6" : "#1f2937",
      "&:active": {
        backgroundColor: isDarkMode ? "#4b5563" : "#e5e7eb",
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: isDarkMode ? "#374151" : "white",
      border: isDarkMode ? "1px solid #4b5563" : "1px solid #e5e7eb",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: isDarkMode ? "#f3f4f6" : "#1f2937",
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      backgroundColor: isDarkMode ? "#4b5563" : "#e5e7eb",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: isDarkMode ? "#9ca3af" : "#6b7280",
      "&:hover": {
        color: isDarkMode ? "#d1d5db" : "#374151",
      },
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      color: isDarkMode ? "#9ca3af" : "#6b7280",
      "&:hover": {
        color: isDarkMode ? "#d1d5db" : "#374151",
      },
    }),
  };

  const handleSaveDraft = (data: IBatch) => {
    onSave(data, true);
    onClose();
  };

  const handleSave = (data: IBatch) => {
    onSave(data, false);
    onClose();
  };

  const formatSchedule = (schedule: IBatchSchedule[]) => {
    if (!schedule || schedule.length === 0) return "";
    return schedule
      .map((s) => `${s.day} ${s.startTime} ${s.endTime} - ${s.duration} hours`)
      .join(", ");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4 font-sans">
      <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {mode === "edit" ? "Edit Batch" : "Create New Batch"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form 
          onSubmit={handleSubmit(handleSave)} 
          className="mt-6 flex flex-col h-full overflow-y-auto pr-2 custom-scroll"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pb-4">
            {/* Course */}
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="courseId"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                <BookOpen size={14} /> Course
              </label>
              <select
                id="course"
                {...register("courseId")}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              >
                <option value="">Select Course</option>
                {courses?.map((course) => {
                  const courseType = course.type?.toLowerCase();
                  let prefix = "";
                  if (courseType === "tecterminal" || courseType === "tec_terminal") {
                    prefix = "TT";
                  } else if (courseType === "aptech") {
                    prefix = "AP";
                  } else if (courseType === "cpms") {
                    prefix = "CP";
                  }
                  const displayName = prefix ? `${prefix} - ${course.name}` : course.name;
                  return (
                    <option key={course.id} value={course.id}>
                      {displayName}
                    </option>
                  );
                })}
              </select>
              {errors.courseId && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.courseId.message}
                </p>
              )}
            </div>

            {/* Center Selection - Show when course is selected */}
            {selectedCourse && (
              <div className="flex flex-col sm:col-span-2">
                <label
                  htmlFor="centerId"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
                >
                  <BookOpen size={14} /> Center
                </label>
                <select
                  id="centerId"
                  {...register("centerId")}
                  className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
                  onChange={(e) => {
                    setValue("centerId", e.target.value, { shouldValidate: true });
                    trigger("centerId");
                  }}
                >
                  <option value="">Select Center</option>
                  {selectedCourse.courseAssignments && selectedCourse.courseAssignments.length > 0 ? (
                    // Show centers from course assignments
                    selectedCourse.courseAssignments.map((assignment: any) => {
                      // Try to get center name from assignment.center.name first
                      let centerName = assignment.center?.name;
                      
                      // If not found, try to find it in allCenters by matching centerId
                      if (!centerName && assignment.centerId) {
                        const matchedCenter = allCenters.find((c: any) => c.id === assignment.centerId);
                        centerName = matchedCenter?.name;
                      }
                      
                      // Final fallback - use centerId but format it nicely
                      if (!centerName) {
                        centerName = `Center ${assignment.centerId}`;
                      }
                      
                      return (
                        <option key={assignment.centerId} value={assignment.centerId}>
                          {centerName}
                        </option>
                      );
                    })
                  ) : (
                    // If no course assignments, show a message (user needs to assign centers to course first)
                    <option value="" disabled>
                      No centers assigned to this course. Please assign centers to the course first.
                    </option>
                  )}
                </select>
                {errors.centerId && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.centerId.message}
                  </p>
                )}
              </div>
            )}

            {/* Status */}
            <div className="flex flex-col relative">
              <label
                htmlFor="status"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                {...register("status")}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors appearance-none"
              >
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.status && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>

            {/* Duration */}
            <div className="flex flex-col relative">
              <label
                htmlFor="duration"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                <Clock size={14} /> Duration (Months)
              </label>
              <select
                id="duration"
                {...register("duration")}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Duration</option>
                {durationOptions.map((duration) => (
                  <option key={duration.value} value={duration.value}>
                    {duration.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.duration && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.duration.message}
                </p>
              )}
            </div>

            {/* Start Date & End Date */}
            <div className="flex flex-col sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-6">
              {/* Start Dtae */}
              <div className="flex flex-col">
                <label
                  htmlFor="startDate"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
                >
                  <Calendar size={14} /> Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  {...register("startDate")}
                  className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
                />
                {errors.startDate && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              {/* End Date */}
              <div className="flex flex-col mt-4 sm:mt-0">
                <label
                  htmlFor="endDate"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
                >
                  <Calendar size={14} /> End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  {...register("endDate")}
                  className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
                />
                {errors.endDate && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Class Schedule Section */}
            <div className="sm:col-span-2 border-t pt-4 border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                  Class Schedule
                </h3>
                <button
                  type="button"
                  className="p-1 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Clock size={16} />
                </button>
              </div>

              {schedules.map((schedule, index) => (
                <div
                  key={schedule.id}
                  className="grid grid-cols-2 gap-4 mb-4 relative border border-gray-200 dark:border-gray-700 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
                >
                  {/* Day */}
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Day
                    </label>
                    <select
                      {...register(`schedules.${index}.day`)}
                      className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none"
                    >
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                      <option value="Saturday">Saturday</option>
                      <option value="Sunday">Sunday</option>
                    </select>
                  </div>

                  {/* Duration */}
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Duration (hours)
                    </label>
                    <input
                      type="number"
                      {...register(`schedules.${index}.duration`, {
                        valueAsNumber: true,
                      })}
                      className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none"
                    />
                  </div>

                  {/* Start Time */}
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Start Time
                    </label>
                    <select
                      {...register(`schedules.${index}.startTime`)}
                      className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none"
                    >
                      <option value="">Select Time</option>
                      {scheduleTimes.map((time) => (
                        <option key={time.value} value={time.value}>
                          {time.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* End Time */}
                  <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      End Time
                    </label>
                    <select
                      {...register(`schedules.${index}.endTime`)}
                      className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none"
                    >
                      <option value="">Select Time</option>
                      {scheduleTimes.map((time) => (
                        <option key={time.value} value={time.value}>
                          {time.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => removeSchedule(index)}
                    className="absolute top-2 right-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              {errors.schedules && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.schedules.message}
                </p>
              )}

              <button
                type="button"
                  onClick={() => {
                  appendSchedule({
                    day: "Monday",
                    startTime: "",
                    endTime: "",
                    duration: 2,
                  });
                  // Trigger validation after adding schedule
                  trigger("schedules");
                }}
                className="mt-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
              >
                + Add Another Schedule
              </button>
            </div>

            {/* Select Faculty */}
            <div className="flex flex-col relative">
              <label
                htmlFor="facultyIds"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                <User size={14} /> Select Faculty
              </label>
              <Controller
                name="facultyIds"
                control={control}
                render={({ field }) => (
                  <Select
                    isMulti
                    name="facultyIds"
                    options={facultyOptions}
                    className="basic-multi-select text-sm text-gray-600"
                    classNamePrefix="select"
                    value={facultyOptions.filter((option) =>
                      field.value?.includes(option.value)
                    )}
                    onChange={(selected) => {
                      field.onChange(selected ? selected.map((s) => s.value) : []);
                      // Trigger validation after change
                      trigger("facultyIds");
                    }}
                    styles={customStyles}
                    placeholder="Select faculty..."
                  />
                )}
              />
              {errors.facultyIds && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.facultyIds.message}
                </p>
              )}
            </div>

            {/* Select Students */}
            <div className="flex flex-col relative">
              <label
                htmlFor="students"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                <Users size={14} /> Select Students
              </label>
              <Controller
                name="students"
                control={control}
                render={({ field }) => (
                  <Select
                    isMulti
                    name="students"
                    options={studentOptions}
                    className="basic-multi-select text-sm text-gray-600"
                    classNamePrefix="select"
                    value={studentOptions.filter((option) =>
                      field.value?.includes(option.value)
                    )}
                    onChange={(selected) => {
                      field.onChange(selected ? selected.map((s) => s.value) : []);
                      // Trigger validation after change
                      trigger("students");
                    }}
                    styles={customStyles}
                    placeholder="Select students..."
                  />
                )}
              />
              {errors.students && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.students.message}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit(handleSaveDraft)}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              className={`px-6 py-2 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                isFormValid && !isLoading
                  ? "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600"
                  : "bg-blue-400 dark:bg-blue-600 cursor-not-allowed opacity-70"
              }`}
              disabled={!isFormValid || isLoading}
            >
              {isLoading && (
                <ImSpinner2 className="animate-spin h-4 w-4" />
              )}
              {isLoading 
                ? (mode === "edit" ? "Updating..." : "Creating...") 
                : (mode === "edit" ? "Update Batch" : "Create Batch")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchModal;
