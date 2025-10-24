"use client";

import {
  paymentMethods,
  paymentPlan,
  paymentTypes,
} from "@/data/view/student.data";
import { enrollStudentCourse, getCourse } from "@/lib/network";
import { showError, showSuccess } from "@/lib/toast";
import { Course } from "@/types/academic/course.interface";
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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(addStudentPaymentSchema),
    defaultValues: {
      studentId: studentId,
      courseId: "",
      amount: 0.0,
      paymentPlan: "",
      paymentType: "",
      paymentMethod: "",
    },
  });
  
  const courseId = watch("courseId");

  useEffect(() => {
    if (!courseId) {
      setSelectedCourse(undefined);
      return;
    }

    const fetchCourse = async () => {
      try {
        const course = await getCourse(courseId);
        console.log("course:", course);
        setSelectedCourse(course);
      } catch (err) {
        console.error("Failed to fetch course details:", err);
      } 
    };

    fetchCourse();
  }, [courseId]);

  const onSubmit = async (payload: CreateStudentPayment) => {
    console.log("Data:", payload);
    try {
      await enrollStudentCourse(payload);
      showSuccess("Payment recorded successfully!");
      queryClient.invalidateQueries(["students"]);
      queryClient.invalidateQueries(["student", studentId]);
      reset();
    } catch (error) {
      console.error("Failed to register course and payment:", error);
      showError("Failed to record payment.");
    }
  };

  return (
    <Card title="Enroll New Course">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Course */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Course of Interest
          </label>
          <select
            {...register("courseId")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none appearance-none"
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
          {errors.courseId && (
            <p className="text-red-500 text-sm">{errors.courseId.message}</p>
          )}
        </div>

        {/* Course Fee */}
        <div className="flex flex-col">
          <label
            htmlFor="courseFee"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Course Fee
          </label>
          <input
            type="text"
            id="courseFee"
            value={
              selectedCourse
                ? `₦${selectedCourse.courseAssignments[0]?.baseFee?.toLocaleString()}`
                : ""
            }
            readOnly
            className="w-full h-10 px-4 text-sm border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none appearance-none text-gray-600 cursor-not-allowed"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            step="0.01"
            {...register("amount")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none appearance-none font-bold"
            placeholder="0.00"
          />
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount.message}</p>
          )}
        </div>

        {/* Payment Plan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Plan
          </label>
          <select
            {...register("paymentPlan")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none appearance-none"
          >
            <option value="">Select Payment Plan</option>
            {paymentPlan?.map((plan) => (
              <option key={plan.name} value={plan.value}>
                {plan.name}
              </option>
            ))}
          </select>
          {errors.paymentPlan && (
            <p className="text-red-500 text-sm">{errors.paymentPlan.message}</p>
          )}
        </div>

        {/* Payment Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Type
          </label>
          <select
            {...register("paymentType")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none appearance-none"
          >
            <option value="">Select Payment Type</option>
            {paymentTypes?.map((plan) => (
              <option key={plan.name} value={plan.value}>
                {plan.name}
              </option>
            ))}
          </select>
          {errors.paymentType && (
            <p className="text-red-500 text-sm">{errors.paymentType.message}</p>
          )}
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Payment Method
          </label>
          <select
            {...register("paymentMethod")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none appearance-none"
          >
            <option value="">Select Payment Method</option>
            {paymentMethods?.map((plan) => (
              <option key={plan.name} value={plan.value}>
                {plan.name}
              </option>
            ))}
          </select>
          {errors.paymentMethod && (
            <p className="text-red-500 text-sm">
              {errors.paymentMethod.message}
            </p>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out shadow-md"
        >
          {isSubmitting ? "Recording..." : "Record Payment"}
        </button>
      </form>
    </Card>
  );
};

export default NewPaymentForm;
