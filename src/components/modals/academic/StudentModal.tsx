import {
  paymentMethods,
  paymentPlan,
  paymentTypes,
  statuses,
} from "@/data/view/student.data";
import { getCourseClient, getCenterBanksClient } from "@/lib/client-network";
import { Course } from "@/types/academic/course.interface";
import {
  IStudent,
  IStudentModalProps,
} from "@/types/academic/student.interface";
import { Bank } from "@/types/finance/bank.interface";
import { enrollmentSchema } from "@/validations/academic/student.validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChevronDown, Info, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ImSpinner2 } from "react-icons/im";

const EnrollStudentModal: React.FC<IStudentModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  courses,
  centers, 
  leads,
  mode = "enroll",
  isLoading = false,
}) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid },
    getValues,
    trigger,
  } = useForm<IStudent>({
    resolver: yupResolver(enrollmentSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      address: "",
      centerId: "",
      enrolledDate: "",
      birthDate: "",
      guardianName: "",
      guardianPhone: "",
      guardianEmail: "",
      guardianAddress: "",
      courseId: "",
      bankId: "",
      batchId: "",
    },
  });

  const leadId = watch("leadId");
  const courseId = watch("courseId");
  const centerId = watch("centerId");
  const paymentplan = watch("paymentPlan");
  const courseFeeValue = watch("courseFee");
  const amount = watch("amount");

  const [selectedCourse, setSelectedCourse] = useState<Course>();
  const [showBaseFeeError, setShowBaseFeeError] = useState(false);
  const [paymentType, setPaymentType] = useState<string>("");

  const [plan, setPlan] = useState<string>("lumpsum");
  const [maxInstallment, setMaxInstallment] = useState<number>(2);
  const [lumpSum, setLumpSum] = useState<number>(0);

  // Get the course assignment for the selected center
  const getCourseAssignmentForCenter = useCallback(() => {
    if (!selectedCourse || !centerId) return null;
    return selectedCourse.courseAssignments?.find(
      (assignment) => assignment.centerId === centerId || assignment.center?.id === centerId
    ) || selectedCourse.courseAssignments?.[0] || null;
  }, [selectedCourse, centerId]);

  const getCurrentFee = useCallback(() => {
    if (!selectedCourse) return 0;
    const courseName = selectedCourse.name?.toLowerCase() || "";
    const fees: { [key: string]: number } = {
      graphic: 500000,
      web: 750000,
      data: 600000,
    };
    for (const [key, value] of Object.entries(fees)) {
      if (courseName.includes(key)) return value;
    }
    const assignment = getCourseAssignmentForCenter();
    return assignment?.lumpSumFee || 0;
  }, [selectedCourse, getCourseAssignmentForCenter]);

  const getOldFee = useCallback(() => {
    const assignment = getCourseAssignmentForCenter();
    return assignment?.oldCourseFee || null;
  }, [getCourseAssignmentForCenter]);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await getCenterBanksClient(centerId);
        const formattedBanks = response.map((item: any) => item);
        setBanks(formattedBanks);
      } catch (error) {
        console.error("Failed to fetch center's banks:", error);
        setBanks([]);
      }
    };

    if (centerId) {
      fetchBanks();
    } else {
      setBanks([]);
    }
  }, [centerId]);

  useEffect(() => {
    if (!selectedCourse) return;

    // Get the course assignment for the selected center
    const assignment = getCourseAssignmentForCenter();
    const lumpSumFee = assignment?.lumpSumFee || 0;
    
    // Get the effective fee: use current price if selected, old price if "old" is selected, otherwise use lumpSumFee
    let effectiveFee: number = 0;
    
    if (paymentType === "current") {
      effectiveFee = getCurrentFee();
    } else if (paymentType === "old") {
      effectiveFee = getOldFee() || lumpSumFee;
    } else {
      effectiveFee = lumpSumFee;
    }

    // Ensure effectiveFee is a valid number
    if (isNaN(effectiveFee) || effectiveFee < 0) {
      effectiveFee = lumpSumFee;
    }

    if (plan === "lumpsum") {
      setValue("lumpSumFee", effectiveFee.toString());
      setLumpSum(effectiveFee);
      setMaxInstallment(2);
    } else {
      const installmentAmount = effectiveFee / maxInstallment;
      setValue("lumpSumFee", installmentAmount.toString());
      setLumpSum(installmentAmount);
    }

    if (paymentType === "current") {
      setValue("courseFee", getCurrentFee().toString());
    } else if (paymentType === "old") {
      const oldFee = getOldFee();
      if (oldFee) {
        setValue("courseFee", oldFee.toString());
      } else {
        // If no old fee exists, reset payment type
        setPaymentType("");
        setValue("courseFee", lumpSumFee.toString());
      }
    } else if (!paymentType) {
      setValue("courseFee", lumpSumFee.toString());
    }
    setValue("numberOfInstallments", maxInstallment?.toString());
  }, [plan, maxInstallment, selectedCourse, paymentType, courseFeeValue, centerId, setValue, getCurrentFee, getOldFee, getCourseAssignmentForCenter]);

  useEffect(() => {
    if (!leadId) return;

    const lead = leads.find((l) => l.id === leadId);
    if (lead) {
      setValue("fullName", lead.fullName, { shouldValidate: true });
      setValue("phone", lead.phone, { shouldValidate: true });
      setValue("email", lead.email, { shouldValidate: true });
      setValue("address", lead.address, { shouldValidate: true });
      setValue("centerId", lead.centerId, { shouldValidate: true });
      setValue("enrolledDate", lead.enquiryDate, { shouldValidate: true });
      setValue("birthDate", lead.birthDate, { shouldValidate: true });
      setValue("guardianName", lead.guardians[0]?.fullname || "", { shouldValidate: true });
      setValue("guardianPhone", lead.guardians[0]?.phone || "", { shouldValidate: true });
      setValue("guardianEmail", lead.guardians[0]?.email || "", { shouldValidate: true });
      setValue("guardianAddress", lead.guardians[0]?.address || "", { shouldValidate: true });
      setValue("courseId", lead.courseId, { shouldValidate: true });
      
      // Trigger validation for all fields after setting values
      setTimeout(() => {
        trigger();
      }, 100);
    }
  }, [leadId, leads, setValue, trigger]);

  useEffect(() => {
    if (!courseId) {
      setSelectedCourse(undefined);
      setPaymentType("");
      return;
    }

    // First try to find course from props (no API call needed)
    const courseFromProps = courses.find(c => c.id === courseId);
    if (courseFromProps) {
      setSelectedCourse(courseFromProps);
      return;
    }

    // If not found in props, fetch from API
    const fetchCourse = async () => {
      try {
        const course = await getCourseClient(courseId);
        setSelectedCourse(course);
      } catch (err) {
        console.error("Failed to fetch course details:", err);
        // Show error but don't break the UI
      }
    };

    fetchCourse();
  }, [courseId, courses]);

  useEffect(() => {
    if (initialData?.leadId) {
      setValue("leadId", initialData.leadId);
    }
  }, [initialData, setValue]);

  // Reset payment type when center changes to ensure correct price options
  useEffect(() => {
    if (centerId && selectedCourse) {
      const assignment = getCourseAssignmentForCenter();
      // If payment type is "old" but no old fee exists for new center, reset it
      if (paymentType === "old" && !assignment?.oldCourseFee) {
        setPaymentType("");
      }
    }
  }, [centerId, selectedCourse, paymentType, getCourseAssignmentForCenter]);

  // Pre-fill form when in edit mode with initialData
  useEffect(() => {
    if (isOpen && mode === "edit" && initialData) {
      reset({
        leadId: initialData.leadId || null,
        fullName: initialData.fullName || "",
        phone: initialData.phone || "",
        email: initialData.email || "",
        address: initialData.address || "",
        status: initialData.status || "",
        centerId: initialData.centerId || "",
        enrolledDate: initialData.enrolledDate || "",
        birthDate: initialData.birthDate || "",
        guardianName: initialData.guardianName || "",
        guardianPhone: initialData.guardianPhone || "",
        guardianEmail: initialData.guardianEmail || null,
        guardianAddress: initialData.guardianAddress || "",
        courseId: initialData.courseId || "",
        bankId: initialData.bankId || "",
        batchId: initialData.batchId || null,
        paymentPlan: initialData.paymentPlan || "",
        paymentType: initialData.paymentType || "",
        paymentMethod: initialData.paymentMethod || "",
        courseFee: initialData.courseFee || null,
        lumpSumFee: initialData.lumpSumFee || null,
        numberOfInstallments: initialData.numberOfInstallments || null,
        amount: initialData.amount || null,
        notes: initialData.notes || null,
      });
      
      // Set payment plan state
      if (initialData.paymentPlan) {
        setPlan(initialData.paymentPlan);
      }
      
      // Set payment type state
      if (initialData.paymentType) {
        setPaymentType(initialData.paymentType);
      }
      
      // Set max installment if provided
      if (initialData.numberOfInstallments) {
        setMaxInstallment(parseInt(initialData.numberOfInstallments) || 2);
      }
    } else if (isOpen && mode === "enroll") {
      // Reset form for new enrollment
      reset({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        centerId: "",
        enrolledDate: "",
        birthDate: "",
        guardianName: "",
        guardianPhone: "",
        guardianEmail: "",
        guardianAddress: "",
        courseId: "",
        bankId: "",
        batchId: "",
      });
      setPlan("lumpsum");
      setPaymentType("");
      setMaxInstallment(2);
    }
  }, [isOpen, mode, initialData, reset, setValue]);

  const handlePaymentPlan = (e: any) => {
    setValue("paymentPlan", e.target.value, { shouldValidate: true });
    setPlan(e.target.value);
  };

  const handlePaymentType = (e: any) => {
    setValue("paymentType", e.target.value, { shouldValidate: true });
  };

  const handlePaymentMethod = (e: any) => {
    setValue("paymentMethod", e.target.value, { shouldValidate: true });
  };

  const handleMaxInstallment = (e: any) => {
    setValue("numberOfInstallments", e.target.value, { shouldValidate: true });
    setMaxInstallment(e.target.value);
  };

  const onSubmit = (data: IStudent | any) => {
    if (showBaseFeeError) return;
    
    // Ensure courseFee is properly set based on payment type
    if (paymentType === "current") {
      // For new price, ensure it's set to the current fee
      data.courseFee = getCurrentFee().toString();
    } else if (paymentType === "old") {
      // For old price, use the old course fee
      data.courseFee = (getOldFee() || getCurrentFee()).toString();
    } else if (!data.courseFee && selectedCourse) {
      // Fallback to lumpSumFee if not set
      const assignment = getCourseAssignmentForCenter();
      data.courseFee = assignment?.lumpSumFee?.toString() || null;
    }
    
    // Ensure courseFee is numeric string (remove any remaining formatting)
    if (data.courseFee && typeof data.courseFee === 'string') {
      data.courseFee = data.courseFee.replace(/[^\d.]/g, '');
      // Convert empty string to null
      if (data.courseFee === '' || isNaN(parseFloat(data.courseFee))) {
        data.courseFee = selectedCourse?.courseAssignments[0]?.lumpSumFee?.toString() || null;
      }
    }
    
    // Ensure lumpSumFee is also numeric
    if (data.lumpSumFee && typeof data.lumpSumFee === 'string') {
      data.lumpSumFee = data.lumpSumFee.replace(/[^\d.]/g, '');
      if (data.lumpSumFee === '' || isNaN(parseFloat(data.lumpSumFee))) {
        // Recalculate based on effective fee
        const effectiveFee = paymentType === "current" 
          ? getCurrentFee() 
          : selectedCourse?.courseAssignments[0]?.lumpSumFee || 0;
        
        if (plan === "lumpsum") {
          data.lumpSumFee = effectiveFee.toString();
        } else {
          data.lumpSumFee = (effectiveFee / (parseInt(data.numberOfInstallments || '2') || 2)).toString();
        }
      }
    }
    
    // Ensure amount (Amount Paid) is properly formatted - CRITICAL FOR PAYMENT RECORDING
    if (data.amount !== null && data.amount !== undefined && data.amount !== '') {
      // Convert to string and clean numeric value
      const amountStr = String(data.amount);
      const numericAmount = amountStr.replace(/[^\d.]/g, '');
      if (numericAmount && !isNaN(parseFloat(numericAmount)) && parseFloat(numericAmount) > 0) {
        data.amount = numericAmount;
      } else {
        // If invalid, set to null (no payment recorded)
        data.amount = null;
      }
    } else {
      // If empty or null, set to null (no payment recorded)
      data.amount = null;
    }
    
    // Ensure all numeric fields are strings (not numbers)
    if (data.courseFee !== null && data.courseFee !== undefined) {
      data.courseFee = String(data.courseFee);
    }
    if (data.lumpSumFee !== null && data.lumpSumFee !== undefined) {
      data.lumpSumFee = String(data.lumpSumFee);
    }
    if (data.numberOfInstallments !== null && data.numberOfInstallments !== undefined) {
      data.numberOfInstallments = String(data.numberOfInstallments);
    }
    if (data.amount !== null && data.amount !== undefined) {
      data.amount = String(data.amount);
    }
    
    // Set status to PENDING_APPROVAL for new enrollments
    if (mode === "enroll") {
      data.status = "PENDING_APPROVAL";
      // Set default program type to REGULAR_STUDENT if not specified
      if (!data.programType) {
        data.programType = "REGULAR_STUDENT";
      }
    }
    
    console.log("Submitting data:", data);
    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-65 flex items-center justify-center z-50 p-4 font-sans">
      <div className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {mode === "edit" ? "Edit Student" : "Enroll New Student"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col h-full overflow-y-auto pr-2 custom-scroll"
        >
          {/* Lead ID */}
          <div className="w-full flex flex-col relative mb-5">
            <label
              htmlFor="leadId"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Lead ID
            </label>
            <div className="relative">
              <select
                id="leadId"
                {...register("leadId")}
                className="w-full h-10 px-4 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors pr-10 appearance-none"
              >
                <option value="">Search lead ID</option>
                {leads.map((lead) => (
                  <option
                    key={lead.id}
                    value={lead.id}
                    className="placeholder:text-gray-400"
                  >
                    {lead.fullName} - {lead.phone}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                onClick={() => setShowTooltip(!showTooltip)}
              >
                <Info size={18} />
              </button>
            </div>
            {errors.leadId && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.leadId.message}
              </p>
            )}
            {/* Tooltip */}
            {showTooltip && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-fit p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg text-sm z-10 before:content-[''] before:absolute before:bottom-full before:left-1/2 before:-translate-x-1/2 before:border-8 before:border-transparent before:border-b-white dark:before:border-b-gray-800">
                <p className="text-gray-700 dark:text-gray-300">
                  Use a Lead ID to auto-populate fields from an existing record.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {/* Full Name */}
            <div className="flex flex-col sm:col-span-1">
              <label
                htmlFor="fullName"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                {...register("fullName")}
                className="w-full h-10 px-4 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.fullName && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div className="flex flex-col sm:col-span-1">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                {...register("phone")}
                className="w-full h-10 px-4 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
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
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                className="w-full h-10 px-4 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.email && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Home Address */}
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="address"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Home Address
              </label>
              <input
                type="text"
                id="address"
                {...register("address")}
                className="w-full h-10 px-4 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.address && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Status - Hidden in enroll mode, automatically set to PENDING_APPROVAL */}
            {mode !== "enroll" && (
              <div className="flex flex-col relative">
                <label
                  htmlFor="status"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  {...register("status")}
                  className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors appearance-none"
                >
                  <option value="">Choose Status</option>
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.name}
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
            )}

            {/* Center */}
            <div className="flex flex-col relative">
              <label
                htmlFor="centerId"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Center
              </label>
              <select
                id="centerId"
                {...register("centerId")}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Center</option>
                {centers.map((center) => (
                  <option key={center.id} value={center.id}>
                    {center.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.courseId && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.courseId.message}
                </p>
              )}
            </div>

            {/* Enrolled Date */}
            <div className="flex flex-col">
              <label
                htmlFor="enrolledDate"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                Enquiry Date
              </label>
              <input
                type="date"
                {...register("enrolledDate")}
                className="w-full h-10 px-4 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.enrolledDate && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.enrolledDate.message}
                </p>
              )}
            </div>

            {/* Birth Date */}
            <div className="flex flex-col">
              <label
                htmlFor="birthDate"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1"
              >
                Birth Date
              </label>
              <input
                type="date"
                {...register("birthDate")}
                className="w-full h-10 px-4 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.birthDate && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.birthDate.message}
                </p>
              )}
            </div>

            {/* Guardian Name */}
            <div className="flex flex-col">
              <label
                htmlFor="guardianName"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Guardian Name
              </label>
              <input
                type="text"
                id="guardianName"
                {...register("guardianName")}
                className="w-full h-10 px-4 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.guardianName && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.guardianName.message}
                </p>
              )}
            </div>

            {/* Guardian Phone Number */}
            <div className="flex flex-col">
              <label
                htmlFor="guardianPhone"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Guardian Phone Number
              </label>
              <input
                type="tel"
                id="guardianPhone"
                {...register("guardianPhone")}
                className="w-full h-10 px-4 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
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
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Guardian Email
              </label>
              <input
                type="email"
                id="guardianEmail"
                {...register("guardianEmail")}
                className="w-full h-10 px-4 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.guardianEmail && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.guardianEmail.message}
                </p>
              )}
            </div>

            {/* Guardian Address */}
            <div className="flex flex-col sm:col-span-2">
              <label
                htmlFor="guardianAddress"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Guardian Address
              </label>
              <input
                type="text"
                id="guardianAddress"
                {...register("guardianAddress")}
                className="w-full h-10 px-4 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.guardianAddress && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.guardianAddress.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2 my-4 h-1 border-t border-gray-200 dark:border-gray-700"></div>

            {/* Course of Interest */}
            <div className="flex flex-col relative">
              <label
                htmlFor="courseId"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Course of Interest
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
                    <option key={course.id} value={course.id}>
                      {displayName}
                    </option>
                  );
                })}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.courseId && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.courseId.message}
                </p>
              )}
            </div>

            {/* Price Type */}
            {selectedCourse && (
              <div className="flex flex-col relative">
                <label
                  htmlFor="priceType"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Price Type
                </label>
                <select
                  id="priceType"
                  value={paymentType}
                  onChange={(e) => {
                    setPaymentType(e.target.value);
                    if (e.target.value === "current") {
                      const fee = getCurrentFee();
                      setValue("courseFee", fee.toString(), { shouldValidate: true });
                    } else if (e.target.value === "old") {
                      const fee = getOldFee();
                      if (fee) {
                        setValue("courseFee", fee.toString(), { shouldValidate: true });
                      }
                    }
                  }}
                  className="w-full h-10 px-3 text-sm text-black dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors appearance-none"
                >
                  <option value="">Select Price Type</option>
                  <option value="current">New Price</option>
                  {getOldFee() && (
                    <option value="old">Old Price</option>
                  )}
                </select>
                <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                  <ChevronDown size={18} />
                </span>
              </div>
            )}

            {/* Course Fee */}
            {selectedCourse && paymentType && (
              <div className="flex flex-col">
                <label
                  htmlFor="courseFee"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Course Fee
                </label>
                {paymentType === "current" ? (
                  <>
                    <input
                      type="text"
                      id="courseFee-display"
                      value={courseFeeValue ? `₦${Number(courseFeeValue).toLocaleString()}` : `₦${getCurrentFee().toLocaleString()}`}
                      readOnly
                      className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-2 border-transparent cursor-not-allowed"
                    />
                    <input
                      type="hidden"
                      {...register("courseFee")}
                      value={getCurrentFee().toString()}
                    />
                  </>
                ) : paymentType === "old" ? (
                  <>
                    <input
                      type="text"
                      id="courseFee-display"
                      value={courseFeeValue ? `₦${Number(courseFeeValue).toLocaleString()}` : `₦${(getOldFee() || 0).toLocaleString()}`}
                      readOnly
                      className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-2 border-transparent cursor-not-allowed"
                    />
                    <input
                      type="hidden"
                      {...register("courseFee")}
                      value={(getOldFee() || 0).toString()}
                    />
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      id="courseFee-display"
                      value={courseFeeValue ? `₦${Number(courseFeeValue).toLocaleString()}` : `₦${(getCourseAssignmentForCenter()?.lumpSumFee || 0).toLocaleString()}`}
                      readOnly
                      className="w-full h-10 px-4 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-2 border-transparent cursor-not-allowed"
                    />
                    <input
                      type="hidden"
                      {...register("courseFee")}
                      value={(getCourseAssignmentForCenter()?.lumpSumFee || 0).toString()}
                    />
                  </>
                )}
              </div>
            )}

            {/* Amount */}
            <div className="flex flex-col relative">
              <label
                htmlFor="amount"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Amount Paid
              </label>
              <input
                type="number"
                id="amount"
                {...register("amount")}
                className="w-full h-10 px-4 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
              {errors.amount && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Bank  */}
            <div className="flex flex-col relative">
              <label
                htmlFor="bankId"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Bank
              </label>
              <select
                id="bankId"
                {...register("bankId")}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Bank</option>
                {banks.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.bankName}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.bankId && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.bankId.message}
                </p>
              )}
            </div>

            {/* Batch */}
            <div className="flex flex-col relative">
              <label
                htmlFor="batchId"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Batch
              </label>
              <select
                id="batchId"
                {...register("batchId")}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Batch</option>
                {(selectedCourse?.batches || []).map((batch) => (
                  <option key={batch.id} value={batch.id}>
                    {batch?.faculty?.fullname} - {batch?.code}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.batchId && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.batchId.message}
                </p>
              )}
            </div>

            {/* Payment Plan */}
            <div className="flex flex-col relative">
              <label
                htmlFor="paymentPlan"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Payment Plan
              </label>
              <select
                id="paymentPlan"
                {...register("paymentPlan")}
                onChange={(e) => {
                  handlePaymentPlan(e);
                }}
                disabled={!selectedCourse}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Payment Plan</option>
                {paymentPlan?.map((plan) => (
                  <option key={plan.name} value={plan.value}>
                    {plan.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.paymentPlan && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.paymentPlan.message}
                </p>
              )}
            </div>

            {/* Payment Type */}
            <div className="flex flex-col relative">
              <label
                htmlFor="paymentType"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Payment Type
              </label>
              <select
                id="paymentType"
                {...register("paymentType")}
                onChange={(e) => {
                  handlePaymentType(e);
                }}
                disabled={!selectedCourse}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Payment Type</option>
                {paymentTypes?.map((plan) => (
                  <option key={plan.name} value={plan.value}>
                    {plan.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.paymentType && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.paymentType.message}
                </p>
              )}
            </div>

            {/* Payment Method */}
            <div className="flex flex-col relative">
              <label
                htmlFor="paymentMethod"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Payment Method
              </label>
              <select
                id="paymentMethod"
                {...register("paymentMethod")}
                onChange={(e) => {
                  handlePaymentMethod(e);
                }}
                disabled={!selectedCourse}
                className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors appearance-none"
              >
                <option value="">Select Payment Method</option>
                {paymentMethods?.map((plan) => (
                  <option key={plan.name} value={plan.value}>
                    {plan.name}
                  </option>
                ))}
              </select>
              <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 pointer-events-none">
                <ChevronDown size={18} />
              </span>
              {errors.paymentMethod && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.paymentMethod.message}
                </p>
              )}
            </div>

            {/* Lump Sum */}
            <div className="flex flex-col">
              <label
                htmlFor="lumpSum"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {paymentplan === "installment" ? "Installment Sum" : "Lump Sum"}
              </label>
              <input
                type="text"
                {...register("lumpSumFee")}
                value={lumpSum ? `₦${lumpSum.toLocaleString()}` : ""}
                readOnly
                className={`w-full h-10 px-4 text-sm text-gray-600 dark:text-gray-300 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-white dark:focus:border-gray-600 focus:outline-none transition-colors`}
              />
              {errors.lumpSumFee && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  {errors.lumpSumFee.message}
                </p>
              )}
            </div>

            {/* No. of Installments */}
            {paymentplan === "installment" && (
              <div className="flex flex-col relative">
                <label
                  htmlFor="numberOfInstallments"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  No. of Installments
                </label>
                <select
                  id="numberOfInstallments"
                  onChange={handleMaxInstallment}
                  disabled={
                    !selectedCourse?.courseAssignments[0]?.maxInstallments
                  }
                  className="w-full h-10 px-3 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors appearance-none"
                >
                  <option value="">Select Installments</option>
                  {selectedCourse?.courseAssignments[0]?.maxInstallments &&
                    Array.from(
                      {
                        length:
                          selectedCourse.courseAssignments[0]?.maxInstallments,
                      },
                      (_, i) => i + 2
                    ).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                </select>
                <span className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none">
                  <ChevronDown size={18} />
                </span>
                {errors.numberOfInstallments && (
                  <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                    {errors.numberOfInstallments.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-6">
            Required base fee is ₦
            {(selectedCourse?.courseAssignments?.[0]?.baseFee || 0).toLocaleString()} for
            enrollment
          </p>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
            Total Deposit: ₦{amount && !isNaN(parseFloat(amount)) ? parseFloat(amount).toLocaleString() : '0'}
          </p>

          {showBaseFeeError && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-2 font-semibold">
              Student does not meet base enrollment fee
            </p>
          )}

          {/* Notes */}
          <div className="flex flex-col sm:col-span-2 mt-4">
            <label
              htmlFor="notes"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Note
            </label>
            <textarea
              id="notes"
              {...register("notes")}
              rows={3}
              className="w-full p-4 text-sm text-gray-600 dark:text-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
            ></textarea>
            {errors.notes && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                {errors.notes.message}
              </p>
            )}
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
              type="submit"
              className={`px-6 py-2 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${
                isValid && !showBaseFeeError && !isLoading
                  ? "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600"
                  : "bg-blue-400 dark:bg-blue-600 cursor-not-allowed opacity-70"
              }`}
              disabled={!isValid || showBaseFeeError || isLoading}
            >
              {isLoading && (
                <ImSpinner2 className="animate-spin h-4 w-4" />
              )}
              {isLoading ? "Enrolling..." : "Enroll"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollStudentModal;
