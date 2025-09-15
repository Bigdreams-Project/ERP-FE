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

const coursesData = ["ADSE", "Frontend", "Cyber Security", "Web Dev"];
const facultyData = ["Brian Scott", "Jane Smith", "Mathew Adams"];
const studentsData = [
  "Brian Hall",
  "Ryan Green",
  "Matthew Johnson",
  "John Edwards",
  "John Kling",
  "Sarah Jones",
  "Frank Poel",
  "Matins Abel",
];

const BatchModal: React.FC<IBatchModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  mode,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
    watch,
    getValues,
  } = useForm<IBatch>({
    resolver: yupResolver(batchSchema),
    mode: "onTouched",
    defaultValues: {
      code: "BDW-WE-001",
      course: "",
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
      faculty: "",
      students: [],
    },
  });

  const [isDraft, setIsDraft] = useState(false);

  // Use watch to dynamically update the display string for class schedule
  const classSchedule = watch("schedule");
  const selectedStudents = watch("students");

  // Reset the form
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        code: "BDW-WE-001",
        course: "",
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
        faculty: "",
        students: [],
      });
    }
  }, [initialData, reset]);

  const onSubmit: SubmitHandler<IBatch> = (data) => {
    onSave(data, isDraft);
    if (!isDraft) {
      onClose();
    }
  };

  const formatSchedule = (schedule: IBatchSchedule[]) => {
    if (!schedule || schedule.length === 0) return "";
    return schedule
      .map(
        (s) => `${s.day} ${s.startTime} ${s.endTime} - ${s.duration} hours`
      )
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
            <p className="text-sm text-gray-500 mt-1">
              Batch Code - {getValues("code")}
            </p>
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col h-full overflow-y-auto pr-2 custom-scroll"
        >
          {/* Main Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {/* Course */}
            <div className="flex flex-col relative">
              <label
                htmlFor="course"
                className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
              >
                <BookOpen size={14} /> Course
              </label>
              <select
                id="course"
                {...register("course")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Course</option>
                {coursesData.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.course && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.course.message}
                </p>
              )}
            </div>

            {/* Start Date & End Date */}
            <div className="flex flex-col sm:col-span-2 sm:grid sm:grid-cols-2 sm:gap-6">
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
                <div key={index} className="grid grid-cols-3 gap-4 mb-2">
                  <div className="flex flex-col relative">
                    <label
                      htmlFor={`classSchedule.${index}.dayOfWeek`}
                      className="text-xs font-medium text-gray-500 mb-1"
                    >
                      Day
                    </label>
                    <select
                      id={`classSchedule.${index}.dayOfWeek`}
                      {...register(`schedule.${index}.day`)}
                      className="w-full h-9 px-3 text-sm rounded-lg bg-gray-100 appearance-none"
                    >
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                    </select>
                    <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <ChevronDown size={18} />
                    </span>
                  </div>
                  <div className="flex flex-col relative">
                    <label
                      htmlFor={`classSchedule.${index}.time`}
                      className="text-xs font-medium text-gray-500 mb-1"
                    >
                      Time
                    </label>
                    <select
                      id={`classSchedule.${index}.startTime`}
                      {...register(`schedule.${index}.startTime`)}
                      className="w-full h-9 px-3 text-sm rounded-lg bg-gray-100 appearance-none"
                    >
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                    </select>
                    <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <ChevronDown size={18} />
                    </span>
                  </div>
                  <div className="flex flex-col relative">
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
                      className="w-full h-9 px-3 text-sm rounded-lg bg-gray-100"
                    />
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
                htmlFor="faculty"
                className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
              >
                <User size={14} /> Faculty
              </label>
              <select
                id="faculty"
                {...register("faculty")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Faculty</option>
                {facultyData.map((faculty) => (
                  <option key={faculty} value={faculty}>
                    {faculty}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.faculty && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.faculty.message}
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
              <select
                id="students"
                multiple
                {...register("students")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors appearance-none"
              >
                {studentsData.map((student) => (
                  <option key={student} value={student}>
                    {student}
                  </option>
                ))}
              </select>
              {errors.students && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.students.message}
                </p>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-[-10px] sm:col-span-2">
              Selected: {selectedStudents.join(", ") || "None"}
            </p>
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
              type="submit"
              onClick={() => setIsDraft(true)}
              className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              onClick={() => setIsDraft(false)}
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
