"use client";

import {
  paymentMethods,
  paymentPlan,
  paymentTypes,
} from "@/data/view/student.data";
import { enrollStudentCourse, getCenterBanks, getCourse } from "@/lib/network";
import { showError, showSuccess } from "@/lib/toast";
import { Course } from "@/types/academic/course.interface";
import { Bank } from "@/types/finance/bank.interface";
import { CreateStudentPayment } from "@/types/requests/student.interface";
import { addStudentPaymentSchema } from "@/validations/academic/student.validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Card from "./Card";

interface Props {
  courses: Course[];
  studentId: string;
}

const NewPaymentForm = ({ courses, studentId }: Props) => {
  const queryClient = useQueryClient();
  const [selectedCourse, setSelectedCourse] = useState<Course>();
  const [banks, setBanks] = useState<Bank[]>([]);
  const [centerId, setCenterId] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<CreateStudentPayment>({
    resolver: yupResolver(addStudentPaymentSchema),
    defaultValues: {
      studentId,
      courseId: "",
      bankId: "",
      amount: 0.0,
      courseFee: 0,
      numberOfInstallments: 0,
      paymentPlan: "",
      paymentType: "",
      paymentMethod: "",
    },
  });

  const courseId = watch("courseId");

  useEffect(() => {
    if (!courseId) {
      setSelectedCourse(undefined);
      setBanks([]);
      setCenterId("");
      return;
    }

    const fetchCourse = async () => {
      try {
        const course = await getCourse(courseId);
        setSelectedCourse(course);
      } catch (err) {
        console.error("Failed to fetch course details:", err);
      }
    };

    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    const fetchBanks = async () => {
      if (!centerId) return;
      try {
        const response = await getCenterBanks(centerId);
        setBanks(response);
      } catch (error) {
        console.error("Failed to fetch center's banks:", error);
      }
    };

    fetchBanks();
  }, [centerId]);

  useEffect(() => {
    if (selectedCourse) {
      setValue(
        "courseFee",
        selectedCourse.courseAssignments[0]?.lumpSumFee || 0
      );
      setValue(
        "numberOfInstallments",
        selectedCourse.courseAssignments[0]?.maxInstallments || 0
      );
    }
  }, [selectedCourse]);

  const onSubmit = async (payload: CreateStudentPayment) => {
    try {
      await enrollStudentCourse(payload);
      showSuccess("Payment recorded successfully!");
      queryClient.invalidateQueries(["students"]);
      queryClient.invalidateQueries(["student", studentId]); 
      reset();
    } catch (error) {
      console.error("Failed to record payment:", error);
      showError("Failed to record payment.");
    }
  };

  return (
    <Card title="Enroll New Course">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Course */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Course of Interest
          </label>
          <select
            {...register("courseId")}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
          {errors.courseId && (
            <p className="text-red-500 dark:text-red-400 text-sm">{errors.courseId.message}</p>
          )}
        </div>

        {/* Center */}
        {selectedCourse?.courseAssignments &&
          selectedCourse?.courseAssignments?.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Select Center
              </label>
              <select
                onChange={(e) => setCenterId(e.target.value)}
                value={centerId}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Select Center</option>
                {selectedCourse.courseAssignments.map((assignment) => (
                  <option
                    key={assignment.center.id}
                    value={assignment.center.id}
                  >
                    {assignment.center.name}
                  </option>
                ))}
              </select>
            </div>
          )}

        {/* Course Fee */}
        <div className="flex flex-col">
          <label
            htmlFor="courseFee"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Course Fee
          </label>
          <input
            type="text"
            id="courseFee"
            {...register("courseFee")}
            value={
              selectedCourse
                ? `₦${selectedCourse.courseAssignments[0]?.lumpSumFee?.toLocaleString()}`
                : ""
            }
            readOnly
            className="w-full h-10 px-4 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none appearance-none text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
          />
        </div>

        {/* Max Installment */}
        <div className="flex flex-col">
          <label
            htmlFor="numberOfInstallments"
            className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Max Installments
          </label>
          <input
            type="text"
            id="numberOfInstallments"
            {...register("numberOfInstallments")}
            value={
              selectedCourse
                ? selectedCourse.courseAssignments[0]?.maxInstallments
                : ""
            }
            readOnly
            className="w-full h-10 px-4 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none appearance-none text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Amount
          </label>
          <input
            type="number"
            step="0.01"
            {...register("amount")}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none font-bold bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            placeholder="0.00"
          />
          {errors.amount && (
            <p className="text-red-500 dark:text-red-400 text-sm">{errors.amount.message}</p>
          )}
        </div>

        {/* Bank */}
        {banks && banks.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bank
            </label>
            <select
              {...register("bankId")}
              className="w-full p-3 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none appearance-none bg-white dark:bg-gray-700"
            >
              <option value="">Select Bank</option>
              {banks.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.bankName}
                </option>
              ))}
            </select>
            {errors.bankId && (
              <p className="text-red-500 dark:text-red-400 text-sm">{errors.bankId.message}</p>
            )}
          </div>
        )}

        {/* Payment Plan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Payment Plan
          </label>
          <select
            {...register("paymentPlan")}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select Payment Plan</option>
            {paymentPlan?.map((plan) => (
              <option key={plan.name} value={plan.value}>
                {plan.name}
              </option>
            ))}
          </select>
          {errors.paymentPlan && (
            <p className="text-red-500 dark:text-red-400 text-sm">{errors.paymentPlan.message}</p>
          )}
        </div>

        {/* Payment Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Payment Type
          </label>
          <select
            {...register("paymentType")}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select Payment Type</option>
            {paymentTypes?.map((plan) => (
              <option key={plan.name} value={plan.value}>
                {plan.name}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Payment Method
          </label>
          <select
            {...register("paymentMethod")}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select Payment Method</option>
            {paymentMethods?.map((plan) => (
              <option key={plan.name} value={plan.value}>
                {plan.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 mt-4 bg-blue-600 dark:bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition duration-150 ease-in-out shadow-md"
        >
          {isSubmitting ? "Recording..." : "Record Payment"}
        </button>
      </form>
    </Card>
  );
};

export default NewPaymentForm;
