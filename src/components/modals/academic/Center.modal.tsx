import { yupResolver } from "@hookform/resolvers/yup";
import { ChevronDown, UploadCloud, X } from "lucide-react";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

export interface ICenter {
  centerName: string;
  location: string;
  centerAddress: string;
  centerManagerName: string;
  contactPhone: string;
  emailAddress: string;
  status: string;
  document: FileList | null;
}

export interface ICenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (centerData: ICenter, isDraft: boolean) => void;
  initialData?: Partial<ICenter>;
  mode: "add" | "edit";
}

export const centerSchema = yup.object().shape({
  centerName: yup.string().required("Center name is required"),
  location: yup.string().required("Location is required"),
  centerAddress: yup.string().required("Center address is required"),
  centerManagerName: yup.string().required("Center Manager name is required"),
  contactPhone: yup
    .string()
    .required("Contact phone is required")
    .matches(
      /^\+\d{1,3} \d{3} \d{3}-\d{4}$/,
      "Phone number must be in the format +234 815 815-9170"
    ),
  emailAddress: yup
    .string()
    .email("Invalid email format")
    .required("Email address is required"),
  status: yup.string().required("Status is required"),
  document: yup
    .mixed()
    .test("required", "You need to provide a file", (value) => {
      return value instanceof FileList && value.length > 0;
    })
    .test("fileSize", "The file is too large (max 2MB)", (value) => {
      return value instanceof FileList && value.length > 0
        ? value[0].size <= 2000000
        : true;
    })
    .optional()
    .nullable()
    .notRequired() as yup.MixedSchema<FileList | null>,
});

const locations = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "FCT",
];

const statuses = ["Active", "In Setup", "Suspended", "Closed"];

const CenterModal: React.FC<ICenterModalProps> = ({
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
    getValues,
  } = useForm<ICenter>({
    resolver: yupResolver(centerSchema),
    mode: "onTouched",
    defaultValues: {
      centerName: "Owerri Center",
      location: "Imo",
      centerAddress: "645 East Street, Baltimore, MD 21215",
      centerManagerName: "Christopher Brown",
      contactPhone: "+234 815 815-9170",
      emailAddress: "madison@hotmail.com",
      status: "Active",
    },
  });

  // Reset the form
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        centerName: "Owerri Center",
        location: "Imo",
        centerAddress: "645 East Street, Baltimore, MD 21215",
        centerManagerName: "Christopher Brown",
        contactPhone: "+234 815 815-9170",
        emailAddress: "madison@hotmail.com",
        status: "Active",
      });
    }
  }, [initialData, reset]);

  const onSubmit: SubmitHandler<ICenter> = (data) => {
    onSave(data, false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4 font-sans">
      <div className="relative bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-800">Add Center</h2>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {/* Center Name */}
            <div className="flex flex-col">
              <label
                htmlFor="centerName"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Center Name
              </label>
              <input
                type="text"
                id="centerName"
                {...register("centerName")}
                className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.centerName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.centerName.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="flex flex-col relative">
              <label
                htmlFor="location"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Location
              </label>
              <select
                id="location"
                {...register("location")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Location</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Center Address */}
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="centerAddress"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Center Address
              </label>
              <input
                type="text"
                id="centerAddress"
                {...register("centerAddress")}
                className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.centerAddress && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.centerAddress.message}
                </p>
              )}
            </div>

            {/* Center Manager Name */}
            <div className="flex flex-col">
              <label
                htmlFor="centerManagerName"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Center Manager Name
              </label>
              <input
                type="text"
                id="centerManagerName"
                {...register("centerManagerName")}
                className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.centerManagerName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.centerManagerName.message}
                </p>
              )}
            </div>

            {/* Contact Phone */}
            <div className="flex flex-col">
              <label
                htmlFor="contactPhone"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Contact Phone
              </label>
              <input
                type="tel"
                id="contactPhone"
                {...register("contactPhone")}
                className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.contactPhone && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.contactPhone.message}
                </p>
              )}
            </div>

            {/* Email Address */}
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="emailAddress"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="emailAddress"
                {...register("emailAddress")}
                className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.emailAddress && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.emailAddress.message}
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
                  <option key={s} value={s}>
                    {s}
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

            {/* Upload Document */}
            <div className="flex flex-col relative">
              <label
                htmlFor="document"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Upload Document
              </label>
              <input
                id="document"
                type="file"
                {...register("document")}
                className="hidden"
              />
              <label
                htmlFor="document"
                className="w-full h-10 flex items-center justify-center gap-2 px-4 text-sm rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 text-gray-600 cursor-pointer hover:border-blue-500 transition-colors"
              >
                <UploadCloud size={16} />
                <span>Choose File</span>
              </label>
              {errors.document && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.document.message}
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
              type="submit"
              className={`px-6 py-2 text-white font-medium rounded-lg transition-colors ${
                isValid
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-400 cursor-not-allowed opacity-70"
              }`}
              disabled={!isValid}
            >
              Finish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CenterModal;
