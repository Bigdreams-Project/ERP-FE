import { locations, statuses, types } from "@/data/view/center.data";
import { ICenter, ICenterModalProps } from "@/types/academic/center.interface";
import { IBank } from "@/types/finance/bank.interface";
import { centerSchema } from "@/validations/academic/center.validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChevronDown, Plus, Trash2, UploadCloud, X } from "lucide-react";
import React, { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

const CenterModal: React.FC<ICenterModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  managers, 
  mode,
}) => {
  const defaultBank: IBank = { 
    bankName: "",
    accountNumber: "",
    accountName: "",
    balance: 0,
  };

  const defaultCenterValues: ICenter = {
    name: "",
    location: "",
    address: "",
    managerId: "",
    phone: "",
    email: "",
    status: "",
    type: "",
    document: null,
    banks: [defaultBank],
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm<ICenter>({
    resolver: yupResolver(centerSchema as any),
    mode: "onTouched",
    defaultValues: defaultCenterValues,
  });

  const { fields: bankFields, append: appendBank, remove: removeBank } = useFieldArray({
    control,
    name: "banks",
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({ ...initialData, banks: initialData.banks && initialData.banks.length > 0 ? initialData.banks : [defaultBank] });
      } else {
        reset(defaultCenterValues);
      }
    }
  }, [isOpen, initialData, reset]);

  const onSubmit = (data: ICenter | any) => {
    onSave(data, true);
    console.log('Data:', data);
    // onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4 font-sans">
      <div className="relative bg-white p-6 rounded-2xl shadow-xl w-full max-w-3xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800">
              {mode === "add" ? "Add New Center" : "Edit Center"}
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col h-full overflow-y-auto pr-2 custom-scroll"
        >
          {/* Basic Information Section */}
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Basic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pb-6 border-b border-gray-200">
            {/* Name */}
            <div className="flex flex-col">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                {...register("name")}
                className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Location */}
            <div className="flex flex-col relative">
              <label htmlFor="location" className="text-sm font-medium text-gray-700 mb-1">
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
              <span className="absolute right-3 top-[calc(1.75rem+4px)] text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.location && (
                <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="flex flex-col sm:col-span-2">
              <label htmlFor="address" className="text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                id="address"
                {...register("address")}
                className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
              )}
            </div>

            {/* Manager */}
            <div className="flex flex-col relative">
              <label htmlFor="managerId" className="text-sm font-medium text-gray-700 mb-1">
                Manager
              </label>
              <select
                id="managerId"
                {...register("managerId")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Manager</option>
                {managers.map((manager) => (
                  <option key={manager.id} value={manager.id}>
                    {manager.fullname}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-[calc(1.75rem+4px)] text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.managerId && (
                <p className="text-red-500 text-xs mt-1">{errors.managerId.message}</p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                {...register("phone")}
                className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Email Address */}
            <div className="flex flex-col sm:col-span-2">
              <label htmlFor="emailAddress" className="text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="emailAddress"
                {...register("email")}
                className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          {/* Financial Details Section - Multi-Bank Implementation */}
          <h3 className="text-lg font-semibold text-gray-700 my-3 flex justify-between items-center">
            Financial Details
            <button
              type="button"
              onClick={() => appendBank(defaultBank)}
              className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors p-2 rounded-lg bg-blue-50"
              aria-label="Add a new bank account"
            >
              <Plus size={16} /> Add Bank
            </button>
          </h3>

          {/* Bank Entries List */}
          {bankFields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 mb-4 border border-gray-200 rounded-xl bg-gray-50 relative"
            >
              {/* Remove Button (for all but the first bank entry if we require at least one) */}
              {bankFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeBank(index)}
                  className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 transition-colors rounded-full bg-white shadow-sm"
                  aria-label={`Remove bank account ${index + 1}`}
                >
                  <Trash2 size={16} />
                </button>
              )}

              <h4 className="text-sm font-bold text-gray-700 mb-3">Bank Account {index + 1}</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {/* Bank Name */}
                <div className="flex flex-col relative">
                  <label
                    htmlFor={`banks.${index}.bankName`}
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    Bank Name
                  </label>
                  {/* Using select for bank name as seen in the image, but defaulting to input for simplicity here */}
                  <input
                    id={`banks.${index}.bankName`}
                    type="text"
                    {...register(`banks.${index}.bankName`)}
                    className="w-full h-10 px-4 text-sm rounded-lg bg-white border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="e.g., Zenith Bank"
                  />
                  {errors.banks?.[index]?.bankName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.banks[index].bankName.message}
                    </p>
                  )}
                </div>

                {/* Account Number */}
                <div className="flex flex-col">
                  <label
                    htmlFor={`banks.${index}.accountNumber`}
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    Account Number
                  </label>
                  <input
                    id={`banks.${index}.accountNumber`}
                    type="text"
                    {...register(`banks.${index}.accountNumber`)}
                    className="w-full h-10 px-4 text-sm rounded-lg bg-white border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="1234567890"
                  />
                  {errors.banks?.[index]?.accountNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.banks[index].accountNumber.message}
                    </p>
                  )}
                </div>

                {/* Account Name */}
                <div className="flex flex-col">
                  <label
                    htmlFor={`banks.${index}.accountName`}
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    Account Name
                  </label>
                  <input
                    id={`banks.${index}.accountName`}
                    type="text"
                    {...register(`banks.${index}.accountName`)}
                    className="w-full h-10 px-4 text-sm rounded-lg bg-white border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="e.g., TecTerminal Enugu"
                  />
                  {errors.banks?.[index]?.accountName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.banks[index].accountName.message}
                    </p>
                  )}
                </div>

                {/* Balance */}
                <div className="flex flex-col">
                  <label
                    htmlFor={`banks.${index}.balance`}
                    className="text-sm font-medium text-gray-700 mb-1"
                  >
                    Balance
                  </label>
                  <input
                    id={`banks.${index}.balance`}
                    type="text"
                    {...register(`banks.${index}.balance`)}
                    className="w-full h-10 px-4 text-sm rounded-lg bg-white border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="e.g., Enugu Main"
                  />
                  {errors.banks?.[index]?.balance && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.banks[index].balance.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-gray-200">
            {/* Status */}
            <div className="flex flex-col relative">
              <label htmlFor="status" className="text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                {...register("status")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Status</option>
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-[calc(1.75rem+4px)] text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.status && (
                <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
              )}
            </div>

            <div className="flex flex-col relative">
              <label htmlFor="status" className="text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                id="type"
                {...register("type")}
                className="w-full h-10 px-3 text-sm rounded-lg bg-gray-100 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Type</option>
                {types.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-[calc(1.75rem+4px)] text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.type && (
                <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
              )}
            </div>

            {/* Upload Document */}
            <div className="flex flex-col  sm:col-span-2 relative">
              <label htmlFor="document" className="text-sm font-medium text-gray-700 mb-1">
                Upload Document
              </label>
              <input id="document" type="file" {...register("document")} className="hidden" />
              <label
                htmlFor="document"
                className="w-full h-10 flex items-center justify-center gap-2 px-4 text-sm rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 text-gray-600 cursor-pointer hover:border-blue-500 transition-colors"
              >
                <UploadCloud size={16} />
                <span>Choose File</span>
              </label>
              {errors.document && (
                <p className="text-red-500 text-xs mt-1">{errors.document.message}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-auto pt-4 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
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
