import {
  durationOptions,
  scheduleTimes,
  statuses,
} from "@/data/view/batch.data";
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
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Select, { ActionMeta, MultiValue } from "react-select";
import { Controller } from "react-hook-form";
import { addHoursToTime } from "@/lib/utils";

const BatchModal: React.FC<IBatchModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  courses,
  students,
  faculties,
  mode,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
    setValue,
    getValues,
    watch,
  } = useForm<IBatch>({
    resolver: yupResolver(batchSchema),
    mode: "onChange",
    defaultValues: {
      courseId: "",
      startDate: "",
      endDate: "",
      schedule: [
        {
          day: "Monday",
          startTime: "02:00 PM",
          endTime: "02:00 PM",
          duration: 2,
        },
      ],
      facultyId: "",
      students: [],
    },
  });

  const [isDraft, setIsDraft] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  // Dynamically update the display string for class schedule
  const classSchedule = watch("schedule");

  useEffect(() => {
    classSchedule.forEach((schedule, index) => {
      if (schedule.startTime) {
        const newEnd = addHoursToTime(schedule.startTime, 2);
        if (newEnd !== schedule.endTime) {
          setValue(`schedule.${index}.endTime`, newEnd);
        }
      }
    });
  }, [classSchedule, setValue]);

  // Reset the form
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        courseId: "",
        startDate: "",
        endDate: "",
        schedule: [
          {
            day: "Monday",
            startTime: "02:00 PM",
            endTime: "02:00 PM",
            duration: 2,
          },
        ],
        facultyId: "",
        students: [],
      });
    }
  }, [initialData, reset]);

  const options = students.map((student) => ({
    value: student.id,
    label: student.fullName,
  }));

  const handleChange = (
    selectedOptions: MultiValue<{ value: string; label: string }>,
    _actionMeta: ActionMeta<{ value: string; label: string }>
  ) => {
    setSelectedStudents(
      selectedOptions ? selectedOptions.map((option) => option.label) : []
    );
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "#f3f4f6",
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
        borderColor: "#3b82f6",
      },
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#dbeafe",
      borderRadius: "9999px",
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "#1e40af",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#9ca3af",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#e5e7eb" : "white",
      color: "#1f2937",
    }),
  };

  const handleSaveDraft = (data: IBatch | any) => {
    // onSave(data, true);
    // onClose();
    console.log(data, true);
  };

  const handleSave = (data: IBatch | any) => {
    // onSave(data, false);
    // onClose();
    console.log(data, false);
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
      <div className="relative bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-800">
              Create New Batch
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
        <form className="mt-6 flex flex-col h-full overflow-y-auto pr-2 custom-scroll">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pb-4">
            {/* Course */}
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="courseId"
                className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
              >
                <BookOpen size={14} /> Course
              </label>
              <select
                id="course"
                {...register("courseId")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="">Select Course</option>
                {courses?.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
              {/* <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span> */}
              {errors.courseId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.courseId.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="flex flex-col relative">
              <label
                htmlFor="status"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                {...register("status")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors appearance-none"
              >
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.status && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.status.message}
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
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100  focus:border-blue-500 focus:outline-none transition-colors"
              >
                {durationOptions.map((duration) => (
                  <option key={duration.value} value={duration.value}>
                    {duration.label}
                  </option>
                ))}
              </select>
              {/* <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span> */}
              {errors.duration && (
                <p className="text-red-500 text-xs mt-1">
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
                  className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
                >
                  <Calendar size={14} /> Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  {...register("startDate")}
                  className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
                />
                {errors.startDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              {/* End Date */}
              <div className="flex flex-col mt-4 sm:mt-0">
                <label
                  htmlFor="endDate"
                  className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
                >
                  <Calendar size={14} /> End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  {...register("endDate")}
                  className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
                />
                {errors.endDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Class Schedule Section */}
            <div className="sm:col-span-2 border-t pt-4 border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-md font-semibold text-gray-800">
                  Class Schedule
                </h3>
                <button
                  type="button"
                  className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Clock size={16} />
                </button>
              </div>

              {classSchedule.map((schedule, index) => (
                <div key={index} className="grid grid-cols-2 gap-4 mb-2">
                  {/* Day */}
                  <div className="flex flex-col ">
                    <label
                      htmlFor={`classSchedule.${index}.dayOfWeek`}
                      className="text-xs font-medium text-gray-500 mb-1"
                    >
                      Day
                    </label>
                    <select
                      id={`classSchedule.${index}.dayOfWeek`}
                      {...register(`schedule.${index}.day`)}
                      className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
                    >
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                    </select>
                  </div>

                  {/* Duration */}
                  <div className="flex flex-col ">
                    <label
                      htmlFor={`classSchedule.${index}.duration`}
                      className="text-xs font-medium text-gray-500 mb-1"
                    >
                      Duration (hours)
                    </label>
                    <input
                      type="number"
                      id={`classSchedule.${index}.duration`}
                      {...register(`schedule.${index}.duration`, {
                        valueAsNumber: true,
                      })}
                      className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Start Time */}
                  <div className="flex flex-col ">
                    <label
                      htmlFor={`classSchedule.${index}.startTime`}
                      className="text-xs font-medium text-gray-500 mb-1"
                    >
                      Start Time
                    </label>
                    <select
                      id={`classSchedule.${index}.startTime`}
                      {...register(`schedule.${index}.startTime`)}
                      className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
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
                  <div className="flex flex-col ">
                    <label
                      htmlFor={`classSchedule.${index}.endTime`}
                      className="text-xs font-medium text-gray-500 mb-1"
                    >
                      End Time
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={classSchedule[index]?.endTime || ""}
                      className="w-full h-10 px-3 text-sm rounded-lg bg-gray-200 border-2 border-transparent cursor-not-allowed"
                    />
                    {/* <select
                      id={`classSchedule.${index}.endTime`}
                      {...register(`schedule.${index}.endTime`)}
                      className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select Time</option>
                      {scheduleTimes.map((time) => (
                        <option key={time.value} value={time.value}>
                          {time.label}
                        </option>
                      ))}
                    </select> */}
                  </div>
                </div>
              ))}
              {errors.schedule && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.schedule.message}
                </p>
              )}
              {/* This is a simple display of the entered schedule, matching the image. */}
              <p className="text-sm text-gray-600 mt-2">
                {formatSchedule(classSchedule)}
              </p>
            </div>

            {/* Faculty */}
            <div className="flex flex-col relative">
              <label
                htmlFor="facultyId"
                className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
              >
                <User size={14} /> Faculty
              </label>
              <select
                id="facultyId"
                {...register("facultyId")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              >
                <option value="">Select Faculty</option>
                {faculties?.map((faculty) => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.fullname}
                  </option>
                ))}
              </select>
              {errors.facultyId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.facultyId.message}
                </p>
              )}
            </div>

            {/* Select Students */}
            <div className="flex flex-col relative">
              <label
                htmlFor="students"
                className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
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
                    options={options}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    // onChange={handleChange}
                    value={options.filter((option) =>
                      field.value?.includes(option.value)
                    )}
                    onChange={(selected) =>
                      field.onChange(selected.map((s) => s.value))
                    }
                    styles={customStyles}
                    placeholder="Select students..."
                  />
                )}
              />
              {errors.students && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.students.message}
                </p>
              )}
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
              Create Batch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchModal;
