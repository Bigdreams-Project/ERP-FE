"use client";

import {
  isPhoneValid,
  isValidEmail,
} from "@/helpers/validations/auth.validation";
import React, { useState, useEffect } from "react";
import { FaBullseye } from "react-icons/fa6";

interface Student {
  id?: string;
  studentId: string;
  fullname: string;
  email: string;
  phone: string;
  address: string;
  parentName: string;
  parentPhone: string;
  parentEmail?: string;
  course: string;
  courseFee: string;
  payment: string;
  batch: string;
  numInstallment: string;
  lumpSumAmt: string;
  comment: string;
}

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (student: Student) => void;
  initialData?: {
    fullname?: string;
    phone?: string;
    email?: string;
    address?: string;
    parentName?: string;
    parentPhone?: string;
    parentEmail?: string;
    course?: {
      name?: string;
      fee?: string;
      baseFee?: string;
    };
    deposit?: string;
  };
  mode: String;
}

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

const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
  mode,
}) => {
  const [form, setForm] = useState<Student>({
    studentId: "",
    fullname: "",
    email: "",
    phone: "",
    address: "",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    course: "",
    courseFee: "",
    payment: "",
    batch: "",
    numInstallment: "",
    lumpSumAmt: "",
    comment: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [errors, setErrors] = useState("");
  const [installmentAmount, setInstallmentAmount] = useState<number | null>(
    null
  );
  const [selectedCourse, setSelectedCourse] = useState<{
    name: string;
    fee: number;
    baseFee: number;
  } | null>(null);

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({
        ...prev,
        fullname: initialData.fullname ?? "",
        email: initialData.email ?? "",
        phone: initialData.phone ?? "",
        address: initialData.address ?? "",
        parentName: initialData.parentName ?? "",
        parentPhone: initialData.parentPhone ?? "",
        parentEmail: initialData.parentEmail ?? "",
        course: initialData.course?.name ?? "",
        payment: initialData.deposit ? "lump-sum" : "",
      }));
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    const requiredFieldsValid =
      form.fullname.trim().length > 0 &&
      isValidEmail(form.email.trim()) &&
      isPhoneValid(form.phone.trim()) &&
      form.address.trim().length > 0 &&
      form.parentName.trim().length > 0 &&
      isPhoneValid(form.parentPhone.trim()) &&
      form.course.trim().length > 0;

    let paymentValid = false;
    let localError = "";

    if (form.payment === "installment") {
      if (form.numInstallment === "") {
        paymentValid = false;
      } else {
        paymentValid = true;
      }
    } else if (form.payment === "lump-sum") {
      paymentValid = true;
      if (form.lumpSumAmt) {
        const lump = Number(form.lumpSumAmt);
        if (
          isNaN(lump) ||
          lump + (initialData?.deposit ? Number(initialData?.deposit) : 0) <
            Number(selectedCourse?.baseFee)
        ) {
          localError =
            `The sum of Lump Sum and already deposited fee must be at least ${selectedCourse?.baseFee}`;
        }
      } else {
        paymentValid = false;
      }
    }

    setErrors(localError);
    setIsFormValid(requiredFieldsValid && paymentValid && !localError);
  }, [form]);

  useEffect(() => {
    if (form.payment !== "installment") {
      setForm((prev) => ({ ...prev, numInstallment: "" }));
      setInstallmentAmount(null);
    }
    if (form.payment !== "lump-sum") {
      setForm((prev) => ({ ...prev, lumpSumAmt: "" }));
    }
  }, [form.payment]);

  useEffect(() => {
    if (form.payment === "installment" && form.numInstallment) {
      const num = Number(form.numInstallment);
      if (selectedCourse?.fee && num > 0) {
        setInstallmentAmount(
          selectedCourse ? Number(selectedCourse.fee) / num : Number("00.00")
        );
      } else {
        setInstallmentAmount(null);
      }
    } else {
      setInstallmentAmount(null);
    }
  }, [form.payment, form.numInstallment, selectedCourse]);

  useEffect(() => {
    if (form.course) {
      const found = coursesData.find((c) => c.name === form.course);
      if (found) {
        setSelectedCourse(found);
        setForm((prev) => ({
          ...prev,
          courseFee: found.fee.toString(),
        }));
      }
    }
  }, [form.course]);

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid || errors) return;
    onSave(form);
    onClose();
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-4/5 md:w-4/5 lg:w-2/5 overflow-auto max-h-screen">
        <h2 className="text-xl font-extrabold text-black">
          {mode === "add" ? "ENROLL NEW STUDENT" : "UPDATE STUDENT"}
        </h2>
        <input
          type="text"
          placeholder="Search Inquiry ID"
          className="w-1/2 h-9 bg-gray-200 rounded-lg text-sm pl-2 text-black"
        />

        <div className="flex text-black mt-7 gap-4">
          <div className="flex flex-col w-2/3">
            <label htmlFor="fullname">Full Name</label>
            <input
              type="text"
              id="fullname"
              placeholder="Input Your Full Name"
              onChange={(e) => {
                setForm({ ...form, fullname: e.target.value });
              }}
              value={form.fullname}
              className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2"
            />
          </div>
          <div className="flex flex-col w-1/3">
            <label htmlFor="phone-number">Phone Number</label>
            <input
              type="number"
              id="phone-number"
              placeholder="+234"
              onChange={(e) => {
                setForm({ ...form, phone: e.target.value });
              }}
              value={form.phone}
              className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2 
                [&::-webkit-outer-spin-button]:appearance-none 
                [&::-webkit-inner-spin-button]:appearance-none 
                "
            />
          </div>
        </div>
        <div className="text-black mt-3 flex flex-col w-full">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Input Email"
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
            }}
            value={form.email}
            className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2"
          />
        </div>
        <div className="text-black mt-3 flex flex-col w-full">
          <label htmlFor="home-address">Home Address</label>
          <input
            type="text"
            id="home-address"
            placeholder="Add Your Home Address"
            onChange={(e) => {
              setForm({ ...form, address: e.target.value });
            }}
            value={form.address}
            className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2"
          />
        </div>
        <div className="flex text-black mt-7 gap-4">
          <div className="flex flex-col w-3/5">
            <label htmlFor="parent-name">Parent/Guardian Name</label>
            <input
              type="text"
              id="parent-name"
              placeholder="Input Parent Name"
              onChange={(e) => {
                setForm({ ...form, parentName: e.target.value });
              }}
              value={form.parentName}
              className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2"
            />
          </div>
          <div className="flex flex-col w-2/5">
            <label htmlFor="parent-phone-number">Parent Phone Number</label>
            <input
              type="number"
              id="parent-phone-number"
              placeholder="+234"
              onChange={(e) => {
                setForm({ ...form, parentPhone: e.target.value });
              }}
              value={form.parentPhone}
              className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2
                [&::-webkit-outer-spin-button]:appearance-none 
                [&::-webkit-inner-spin-button]:appearance-none
              "
            />
          </div>
        </div>
        <div className="text-black mt-3 flex flex-col w-full">
          <label htmlFor="email">Parent/Guardian Email {"(Optional)"}</label>
          <input
            type="email"
            id="email"
            placeholder="Input Email"
            onChange={(e) => {
              setForm({ ...form, parentEmail: e.target.value });
            }}
            value={form.parentEmail}
            className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2"
          />
        </div>
        <div className="text-black mt-3 flex flex-col w-full relative">
          <label htmlFor="email">Course Of Interest</label>
          <select
            name=""
            id=""
            onChange={(e) => {
              setForm({ ...form, course: e.target.value });
            }}
            value={form.course}
            className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2 appearance-none"
          >
            <option value="">Select Course</option>
            {coursesData.map((course) => (
              <option key={course.name} value={course.name}>
                {course.name}
              </option>
            ))}
          </select>
          <span className="absolute right-3 top-[40px] -translate-y-1/2 pointer-events-none text-gray-500">
            ⮟
          </span>
        </div>
        <p className="text-gray-500 mt-3">
          Course fee is ₦
          {selectedCourse ? selectedCourse.fee.toLocaleString() : "00.00"}
        </p>
        <div className="flex text-black mt-7 gap-4">
          <div className="flex flex-col w-1/2 relative">
            <label htmlFor="batch">Batch</label>
            <select
              name=""
              id="batch"
              onChange={(e) => {
                setForm({ ...form, batch: e.target.value });
              }}
              value={form.batch}
              className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2 appearance-none"
            >
              <option value="">Select Batch</option>
              <option value="tt-jan-march">TT-Jan-March</option>
              <option value="tt-april-march">TT-April-June</option>
              <option value="tt-july-sept">TT-July-Sept</option>
              <option value="tt-oct-dec">TT-Oct-Dec</option>
            </select>
            <span className="absolute right-3 top-[40px] -translate-y-1/2 pointer-events-none text-gray-500">
              ⮟
            </span>
          </div>
          <div className="flex flex-col w-1/2 relative">
            <label htmlFor="payment">Payment Plan</label>
            <select
              name=""
              id="payment"
              onChange={(e) => {
                setForm({ ...form, payment: e.target.value });
              }}
              value={form.payment}
              className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2 appearance-none"
            >
              <option value="">Choose Payment</option>
              <option value="lump-sum">Lump Sum</option>
              <option value="installment">Installment</option>
            </select>
            <span className="absolute right-3 top-[40px] -translate-y-1/2 pointer-events-none text-gray-500">
              ⮟
            </span>
          </div>
        </div>
        {form.payment === "installment" && (
          <div className="flex text-black mt-7 gap-4">
            <div className="flex flex-col w-1/2 relative">
              <label htmlFor="no-of-installment">No. Of Installments</label>
              <select
                name=""
                id="no-of-installment"
                onChange={(e) => {
                  setForm({ ...form, numInstallment: e.target.value });
                }}
                value={form.numInstallment}
                className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2 appearance-none"
              >
                <option value="">Choose No Of Installment</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
              <span className="absolute right-3 top-[40px] -translate-y-1/2 pointer-events-none text-gray-500">
                ⮟
              </span>
            </div>
            {installmentAmount && (
              <div className="flex flex-col w-1/2">
                <label htmlFor="installment-fee">Installment Fee</label>
                <input
                  type="text"
                  id="fullname"
                  value={`₦${installmentAmount?.toLocaleString()}`}
                  readOnly
                  className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2 opacity-50"
                />
              </div>
            )}
          </div>
        )}

        {form.payment === "lump-sum" && (
          <div className="flex text-black mt-7 gap-4">
            <div className="flex flex-col w-1/2">
              <label htmlFor="lump-sum">Lump Sum</label>
              <input
                type="number"
                id="lumpsum"
                placeholder="₦0.00"
                onChange={(e) => {
                  setForm({ ...form, lumpSumAmt: e.target.value });
                }}
                value={form.lumpSumAmt}
                className="w-full h-9 bg-gray-200 rounded-lg text-sm pl-2
                  [&::-webkit-outer-spin-button]:appearance-none 
                  [&::-webkit-inner-spin-button]:appearance-none
                "
              />
            </div>
          </div>
        )}

        <p className="text-gray-500 mt-3">
          Required base fee is ₦
          {selectedCourse ? selectedCourse.baseFee.toLocaleString() : "00.00"}{" "}
          for enrollment
        </p>
        <p className="text-black mt-3">
          {initialData?.deposit
            ? `Total deposit recorded: ₦${initialData.deposit.toLocaleString()}`
            : "There's no deposit yet!"}
        </p>
        <div className="text-black mt-3 flex flex-col w-full">
          <label htmlFor="comments">Comments</label>
          <textarea
            id="comments"
            placeholder="Add Your Comment"
            onChange={(e) => {
              setForm({ ...form, comment: e.target.value });
            }}
            value={form.comment}
            className="w-full h-28 bg-gray-200 rounded-lg text-sm pl-2 pt-1 pr-2"
          />
        </div>

        <div className="flex float-right">
          <button
            onClick={onClose}
            className="mt-4 px-4 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-600 hover:text-gray-100 mr-1 duration-500 ease-in-out"
          >
            Close
          </button>
          <button
            className={`mt-4 px-4 py-1  text-white rounded duration-500 ease-in-out ${
              isFormValid
                ? "bg-[hsl(237,74%,60%)] hover:bg-[hsl(237,74%,45%)]"
                : "bg-[#636ae8] opacity-70 cursor-not-allowed"
            }`}
            disabled={!isFormValid}
            onClick={handleStudentSubmit}
          >
            Complete
          </button>
        </div>
        {errors && form.lumpSumAmt && (
          <p className="text-red-600 text-sm mt-2">{errors}</p>
        )}
      </div>
    </div>
  );
};

export default StudentModal;
