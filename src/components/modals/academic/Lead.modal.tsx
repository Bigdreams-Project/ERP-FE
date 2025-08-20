"use client";
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
  User
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const coursesData = [
  {
    name: "ADSE",
    fee: 3000000,
    baseFee: 500000,
  },
  {
    name: "Frontend",
    fee: 300000,
    baseFee: 100000,
  },
  {
    name: "Cyber Security",
    fee: 1000000,
    baseFee: 300000,
  },
  {
    name: "Web Dev",
    fee: 450000,
    baseFee: 200000,
  },
];

const LeadModal: React.FC<ILeadModalProps> = ({
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
  } = useForm<ILead>({
    resolver: yupResolver(leadSchema),
    mode: "onTouched",
    defaultValues: {
      fullname: "",
      email: "",
      phone: "",
      address: "",
      parentName: "",
      parentPhone: "",
      parentEmail: "",
      course: "",
      enquiryDate: "",
      source: "",
      status: "",
      nextFollowup: "",
      studyType: "",
    },
  });

  const selectedCourseName = watch("course");
  const [selectedCourse, setSelectedCourse] = useState<{
    name: string;
    fee: number;
    baseFee: number;
  } | null>(null);

  useEffect(() => {
    const found = coursesData.find((c) => c.name === selectedCourseName);
    if (found) {
      setSelectedCourse(found);
    } else {
      setSelectedCourse(null);
    }
  }, [selectedCourseName]);

  // Reset the form
  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        course: initialData.course?.name ?? "",
        enquiryDate: initialData.enquiryDate ?? "",
        source: initialData.source ?? "",
        status: initialData.status ?? "",
        nextFollowup: initialData.nextFollowup ?? "",
        studyType: initialData.studyType ?? "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = (data: ILead) => {
    onSave(data);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4 font-sans">
      <div className="relative bg-white p-6 rounded-xl shadow-xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {mode === "add" ? "Add Lead" : "Update Lead"}
          </h2>
          <Image
            src="/images/x.svg"
            alt="close icon"
            className="bg-white flex items-center justify-center p-[6px] rounded-md shadow-md shadow-slate-400 absolute top-[3px] right-[3px] object-cover cursor-pointer"
            onClick={onClose}
            width={25}
            height={25}
          />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="h-[95%] pb-6 pr-6 custom-scroll overflow-auto"
        >
          {/* Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 mt-7 gap-x-6 gap-y-4">
            {/* Full Name */}
            <div className="flex flex-col">
              <label
                htmlFor="fullname"
                className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
              >
                <User size={14} /> Full Name
              </label>
              <input
                type="text"
                id="fullname"
                placeholder="Aisha Bukola Nneka"
                {...register("fullname")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.fullname && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fullname.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="flex flex-col">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
              >
                <Phone size={14} /> Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                placeholder="(234) 905-256-8454"
                {...register("phone")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
              >
                <Mail size={14} /> Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="jane@example.com"
                {...register("email")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="address"
                className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
              >
                <Home size={14} /> Home Address
              </label>
              <input
                type="text"
                id="address"
                placeholder="1020 West Street, Las Vegas, NV 89104"
                {...register("address")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Parent/Guardian Name */}
            <div className="flex flex-col">
              <label
                htmlFor="parentName"
                className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
              >
                <User size={14} /> Parent/Guardian Name
              </label>
              <input
                type="text"
                id="parentName"
                placeholder="John Doe Emeka"
                {...register("parentName")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.parentName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.parentName.message}
                </p>
              )}
            </div>

            {/* Parent Phone */}
            <div className="flex flex-col">
              <label
                htmlFor="parentPhone"
                className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
              >
                <Phone size={14} /> Parent/Guardian Phone
              </label>
              <input
                type="tel"
                id="parentPhone"
                placeholder="(234) 905-256-8454"
                {...register("parentPhone")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.parentPhone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.parentPhone.message}
                </p>
              )}
            </div>

            {/* Parent Email */}
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="parentEmail"
                className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
              >
                <Mail size={14} /> Parent/Guardian Email (Optional)
              </label>
              <input
                type="email"
                id="parentEmail"
                placeholder="john@example.com"
                {...register("parentEmail")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.parentEmail && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.parentEmail.message}
                </p>
              )}
            </div>

            {/* Course of Interest */}
            <div className="flex flex-col relative">
              <label
                htmlFor="course"
                className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
              >
                <BookOpen size={14} /> Course of Interest
              </label>
              <select
                id="course"
                {...register("course")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Course</option>
                {coursesData.map((course) => (
                  <option key={course.name} value={course.name}>
                    {course.name}
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

            {/* Enquiry Date */}
            <div className="flex flex-col">
              <label
                htmlFor="enquiryDate"
                className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
              >
                <Calendar size={14} /> Enquiry Date
              </label>
              <input
                type="date"
                id="enquiryDate"
                {...register("enquiryDate")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.enquiryDate && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.enquiryDate.message}
                </p>
              )}
            </div>

            {/* Source */}
            <div className="flex flex-col relative">
              <label
                htmlFor="source"
                className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
              >
                <MapPin size={14} /> Source
              </label>
              <select
                id="source"
                {...register("source")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Source</option>
                <option value="Online Ad">Online Ad</option>
                <option value="Referral">Referral</option>
                <option value="Walk-in">Walk-in</option>
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.source && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.source.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="flex flex-col relative">
              <label
                htmlFor="status"
                className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
              >
                <CheckCircle size={14} /> Status
              </label>
              <select
                id="status"
                {...register("status")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Choose Status</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Converted">Converted</option>
                <option value="Lost">Lost</option>
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

            {/* Next Follow-up */}
            <div className="flex flex-col">
              <label
                htmlFor="nextFollowup"
                className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
              >
                <Clock size={14} /> Next Follow-up
              </label>
              <input
                type="date"
                id="nextFollowup"
                {...register("nextFollowup")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.nextFollowup && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.nextFollowup.message}
                </p>
              )}
            </div>

            {/* Study Type */}
            <div className="flex flex-col relative">
              <label
                htmlFor="studyType"
                className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
              >
                <FileText size={14} /> Study Type
              </label>
              <select
                id="studyType"
                {...register("studyType")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Choose Type</option>
                <option value="Online">Online</option>
                <option value="On-site">On-site</option>
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.studyType && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.studyType.message}
                </p>
              )}
            </div>

            {/* Note */}
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="fullname"
                className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"
              >
                <Notebook size={14} /> Note
              </label>
              <textarea
                id="note"
                cols={4}
                placeholder="Add conversation here"
                {...register("note")}
                className="w-full h-24 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.fullname && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fullname.message}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2 text-white font-medium rounded-lg transition-colors ${
                isValid
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-400 cursor-not-allowed opacity-70"
              }`}
              disabled={!isValid}
            >
              {mode === "add" ? "Add Lead" : "Update Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;
