"use client";
import { locations } from "@/data/view/center.data";
import { ILead, ILeadModalProps } from "@/types/academic/lead.interface";
import { leadSchema } from "@/validations/academic/lead.validations";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  FileText,
  Home,
  Mail,
  MapPin,
  Notebook,
  Phone,
  School,
  User,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { GiTeacher } from "react-icons/gi";
import { ImSpinner2 } from "react-icons/im";

const LeadModal: React.FC<ILeadModalProps> = ({
  isOpen,
  onClose,
  centers,
  courses,
  initialData,
  onSave,
  mode,
  isLoading = false,
}) => {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [enquiryDate, setEnquiryDate] = useState<Date | null>(null);
  const [nextFollowUpDate, setNextFollowUpDate] = useState<Date | null>(null);
  const [lastFollowUpDate, setLastFollowUpDate] = useState<Date | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<{
    name: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<ILead>({
    resolver: yupResolver(leadSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      guardianName: "",
      guardianPhone: "",
      guardianEmail: "",
      courseId: "",
      enquiryDate: "",
      source: "",
      status: "",
      lastFollowUpDate: "",
      studyType: "",
    },
  });

  const selectedCourseName = watch("courseId");

  useEffect(() => {
    const found = courses.find((c) => c.name === selectedCourseName);
    if (found) {
      setSelectedCourse(found);
    } else {
      setSelectedCourse(null);
    }
  }, [selectedCourseName]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({
          ...initialData,
          centerId: initialData.centerId ?? "",
          courseId: initialData.courseId ?? "",
          enquiryDate: initialData.enquiryDate ?? "",
          source: initialData.source ?? "",
          status: initialData.status ?? "",
          assignedTo: initialData.assignedTo ?? "",
          lastFollowUpDate: initialData.lastFollowUpDate ?? "",
          nextFollowUpDate: initialData.nextFollowUpDate ?? "",
          studyType: initialData.studyType ?? "",
        });
      }
    }
  }, [isOpen, initialData, reset]);

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        centerId: initialData.centerId ?? "",
        courseId: initialData.courseId ?? "",
        enquiryDate: initialData.enquiryDate ?? "",
        source: initialData.source ?? "",
        status: initialData.status ?? "",
        assignedTo: initialData.assignedTo ?? "",
        lastFollowUpDate: initialData.lastFollowUpDate ?? "",
        nextFollowUpDate: initialData.nextFollowUpDate ?? "",
        studyType: initialData.studyType ?? "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data: ILead | any) => {
    onSave(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4 font-sans">
      <div className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {mode === "add" ? "Add Lead" : "Update Lead"}
          </h2>
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
          onSubmit={handleSubmit(onSubmit)}
          className="h-[95%] pb-6 pr-6 custom-scroll overflow-auto"
        >
          {/* Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 mt-7 gap-x-6 gap-y-4">
            {/* Full Name */}
            <div className="flex flex-col">
              <label
                htmlFor="fullName"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                <User size={14} /> Full Name
              </label>
              <input
                type="text"
                id="fullname"
                placeholder="Aisha Bukola Nneka"
                {...register("fullName")}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.fullName && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="flex flex-col">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                <Phone size={14} /> Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                placeholder="(234) 905-256-8454"
                {...register("phone")}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.phone && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                <Mail size={14} /> Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="jane@example.com"
                {...register("email")}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.email && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="address"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                <Home size={14} /> Home Address
              </label>
              <input
                type="text"
                id="address"
                placeholder="1020 West Street, Las Vegas, NV 89104"
                {...register("address")}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.address && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Guardian Name */}
            <div className="flex flex-col">
              <label
                htmlFor="guardianName"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                <User size={14} /> Guardian Name
              </label>
              <input
                type="text"
                id="guardianName"
                placeholder="John Doe Emeka"
                {...register("guardianName")}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.guardianName && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.guardianName.message}
                </p>
              )}
            </div>

            {/* Guardian Phone */}
            <div className="flex flex-col">
              <label
                htmlFor="guardianPhone"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                <Phone size={14} /> Guardian Phone
              </label>
              <input
                type="tel"
                id="guardianPhone"
                placeholder="(234) 905-256-8454"
                {...register("guardianPhone")}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.guardianPhone && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.guardianPhone.message}
                </p>
              )}
            </div>

            {/* Guardian Email */}
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="guardianEmail"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                <Mail size={14} /> Guardian Email (Optional)
              </label>
              <input
                type="email"
                id="guardianEmail"
                placeholder="john@example.com"
                {...register("guardianEmail")}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.guardianEmail && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.guardianEmail.message}
                </p>
              )}
            </div>

            {/* Center */}
            <div className="flex flex-col relative">
              <label
                htmlFor="centerId"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                <School size={14} /> Center
              </label>
              <select
                id="centerId"
                {...register("centerId")}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Center</option>
                {centers.map((center) => (
                  <option key={center.name} value={center.id}>
                    {center.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.centerId && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.centerId.message}
                </p>
              )}
            </div>

            {/* Course of Interest */}
            <div className="flex flex-col relative">
              <label
                htmlFor="course"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                <BookOpen size={14} /> Course of Interest
              </label>
              <select
                id="courseId"
                {...register("courseId")}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Course</option>
                {courses.map((course) => {
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
                    <option key={course.name} value={course.id}>
                      {displayName}
                    </option>
                  );
                })}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.courseId && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.courseId.message}
                </p>
              )}
            </div>

            {/* Birth Date */}
            <div className="flex flex-col">
              <label
                htmlFor="birthDate"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                <Calendar size={14} /> Birth Date
              </label>
              <DatePicker
                selected={birthDate}
                onChange={(date) => {
                  if (date) {
                    setBirthDate(date);
                    setValue("birthDate", date.toISOString().split("T")[0], {
                      shouldValidate: true,
                    });
                  }
                }}
                dateFormat="yyyy-MM-dd"
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.birthDate && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.birthDate.message}
                </p>
              )}
            </div>

            {/* Enquiry Date */}
            <div className="flex flex-col">
              <label
                htmlFor="enquiryDate"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                <Calendar size={14} /> Enquiry Date
              </label>
              <DatePicker
                selected={enquiryDate}
                onChange={(date) => {
                  if (date) {
                    setEnquiryDate(date);
                    setValue("enquiryDate", date.toISOString().split("T")[0], {
                      shouldValidate: true,
                    });
                  }
                }}
                dateFormat="yyyy-MM-dd"
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.enquiryDate && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.enquiryDate.message}
                </p>
              )}
            </div>

            {/* Source */}
            <div className="flex flex-col relative">
              <label
                htmlFor="source"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                <MapPin size={14} /> Source
              </label>
              <select
                id="source"
                {...register("source")}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Source</option>
                <option value="Online Ad">Online Ad</option>
                <option value="Referral">Referral</option>
                <option value="Walk-in">Walk-in</option>
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.source && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.source.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="flex flex-col relative">
              <label
                htmlFor="status"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                <CheckCircle size={14} /> Status
              </label>
              <select
                id="status"
                {...register("status")}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Choose Status</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
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

            {/* Last Follow-up */}
            <div className="flex flex-col">
              <label
                htmlFor="lastFollowUpDate"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                <Clock size={14} /> Last Follow-up
              </label>
              <DatePicker
                selected={lastFollowUpDate}
                onChange={(date) => {
                  if (date) {
                    setLastFollowUpDate(date);
                    setValue(
                      "lastFollowUpDate",
                      date.toISOString().split("T")[0],
                      {
                        shouldValidate: true,
                      }
                    );
                  }
                }}
                dateFormat="yyyy-MM-dd"
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.lastFollowUpDate && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.lastFollowUpDate.message}
                </p>
              )}
            </div>

            {/* Next Follow-up */}
            <div className="flex flex-col">
              <label
                htmlFor="nextFollowUpDate"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                <Clock size={14} /> Next Follow-up
              </label>
              <DatePicker
                selected={nextFollowUpDate}
                onChange={(date) => {
                  if (date) {
                    setNextFollowUpDate(date);
                    setValue(
                      "nextFollowUpDate",
                      date.toISOString().split("T")[0],
                      {
                        shouldValidate: true,
                      }
                    );
                  }
                }}
                dateFormat="yyyy-MM-dd"
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.nextFollowUpDate && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.nextFollowUpDate.message}
                </p>
              )}
            </div>

            {/* Study Type */}
            <div className="flex flex-col relative">
              <label
                htmlFor="studyType"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                <FileText size={14} /> Study Type
              </label>
              <select
                id="studyType"
                {...register("studyType")}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Choose Type</option>
                <option value="Online">Online</option>
                <option value="On-site">On-site</option>
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.studyType && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.studyType.message}
                </p>
              )}
            </div>
 
            {/* Assigned To */}
            <div className="flex flex-col">
              <label
                htmlFor="assignedTo"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                <GiTeacher size={14} /> Assigned To
              </label>
              <input
                type="text"
                id="assignedTo"
                placeholder="Jerry Okeke Aliyu"
                {...register("assignedTo")}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.assignedTo && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.assignedTo.message}
                </p>
              )}
            </div>

            {/* Note */}
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="fullname"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                <Notebook size={14} /> Note
              </label>
              <textarea
                id="note"
                cols={4}
                placeholder="Add conversation here"
                {...register("note")}
                className="w-full h-24 px-3 pt-1 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.note && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.note.message}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                isValid && !isLoading
                  ? "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600"
                  : "bg-blue-400 dark:bg-blue-600 cursor-not-allowed opacity-70"
              }`}
              disabled={!isValid || isLoading}
            >
              {isLoading && (
                <ImSpinner2 className="animate-spin h-4 w-4" />
              )}
              {isLoading
                ? mode === "add"
                  ? "Adding Lead..."
                  : "Updating Lead..."
                : mode === "add"
                ? "Add Lead"
                : "Update Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
