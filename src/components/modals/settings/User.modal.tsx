import { roles, Status, statuses } from "@/data/view/user.data";
import { IUser, IUserModalProps } from "@/types/settings/user.interface";
import { userSchema } from "@/validations/settings/user.validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Users, X } from "lucide-react";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

const UserModal: React.FC<IUserModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  mode,
  centers,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
    watch,
  } = useForm<IUser>({
    resolver: yupResolver(userSchema),
    mode: "onChange",
  });

  const selectedCenters = watch("centers");

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "",
        status: Status.PENDING,
        centers: [],
      });
    }
  }, [initialData, reset]);

  if (!isOpen) return null;

  const handleSave = (data: IUser) => {
    onSave(data);
    onClose();
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: "#f3f4f6",
      borderColor: "transparent",
      boxShadow: "none",
      "&:hover": { borderColor: "transparent" },
      minHeight: "40px",
      borderRadius: "8px",
      paddingLeft: "0.5rem",
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
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 font-sans">
      <div className="relative bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {mode === "edit" ? "Edit User" : "Create New User"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          className="mt-6 flex flex-col h-full overflow-y-auto pr-2 custom-scroll"
          onSubmit={handleSubmit(handleSave)}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pb-4">
            {/* Firstname */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Firstname
              </label>
              <input
                type="text"
                {...register("firstname")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none"
              />
              {errors.firstname && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.firstname.message}
                </p>
              )}
            </div>

            {/* Lastname */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Lastname
              </label>
              <input
                type="text"
                {...register("lastname")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none"
              />
              {errors.lastname && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.lastname.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col sm:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Role */}
            <div className="flex flex-col relative">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                {...register("role")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500"
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* Status */}
            <div className="flex flex-col relative">
              <label className="text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                {...register("status")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500"
              >
                {statuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.status.message}
                </p>
              )}
            </div>

            {/* Centers */}
            <div className="flex flex-col sm:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Users size={14} /> Centers
              </label>
              <Controller
                name="centers"
                control={control}
                render={({ field }) => (
                  <Select
                    isMulti
                    options={centers.map((center) => ({
                      value: center.id,
                      label: center.name,
                    }))}
                    value={centers
                      .filter((center) => field.value?.includes(center.id))
                      .map((c) => ({ value: c.id, label: c.name }))}
                    onChange={(selected) =>
                      field.onChange(selected.map((s) => s.value))
                    }
                    styles={customStyles}
                    placeholder="Select centers..."
                  />
                )}
              />
              {errors.centers && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.centers.message}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-auto pt-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300"
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
              {mode === "edit" ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
