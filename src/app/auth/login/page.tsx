"use client";
import { AppAuthRoutes, DashboardAcademicRoutes } from "@/constants/appRoutes.constant";
import { loginUser } from "@/lib/auth/login";
import { ILoginUser } from "@/types/auth/login.interface";
import { loginSchema } from "@/validations/auth/login.validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CiMail } from "react-icons/ci";
import { FaSpinner } from "react-icons/fa6";
import { GiCheckMark } from "react-icons/gi";
import { ImSpinner2 } from "react-icons/im";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { PiLockKeyThin } from "react-icons/pi";
import * as yup from "yup";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onTouched",
  });

  const { mutate, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      router.push(DashboardAcademicRoutes.DASHBOARD);
    },
    onError: (error: Error) => {
      setApiError(error.message || "Invalid email or password.");
    },
  });

  const onSubmit = (data: ILoginUser) => {
    setApiError("");
    mutate(data);
  };

  const emailValue = watch("email");
  const passwordValue = watch("password");

  const isEmailValid = yup.string().email().isValidSync(emailValue);
  const isPasswordValid = yup
    .string()
    .min(8)
    .matches(/[a-z]/)
    .matches(/[A-Z]/)
    .matches(/\d/)
    .matches(/[^a-zA-Z0-9]/)
    .isValidSync(passwordValue);

  return (
    <div className="w-full md:flex md:justify-center md:items-center min-h-screen md:gap-[2rem] md:px-[3rem] md:py-[2rem] md:flex-row p-[1rem] flex flex-col gap-[2.5rem] bg-white text-gray-900">
      <div
        className={`w-full md:w-[60%] flex justify-between items-center md:flex-row`}
      >
        <img src="/Logo.png" alt="" />
      </div>

      {/* Form */}
      <div className="w-full md:w-[45%] md:px-[1rem]">
        <div
          className="w-[100%] flex flex-col gap-[2rem] p-[2rem] rounded-[1rem] md:shadow-lg"
          style={{ boxShadow: "0rem 0rem 0.7rem rgba(0, 0, 0, 0.1)" }}
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-[32px] font-bold">Welcome Back 👋</h2>
            <p className="">Login to your account</p>
          </div>

          {isPending ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <FaSpinner className="animate-spin text-[#636AE8] text-4xl" />
              <p className="text-gray-500 font-medium text-sm">
                Just a second...
              </p>
            </div>
          ) : (
            <form
              className={`flex flex-col gap-5`}
              onSubmit={handleSubmit(onSubmit)}
            >
              <div
                className={`flex items-center gap-2 bg-[#eef2ff] p-3 rounded-2xl
                  ${
                    emailValue
                      ? isEmailValid
                        ? "border-2 border-[#636AE8] shadow-[0_0_6px_#636AE8]"
                        : "border-2 border-red-500 shadow-[0_0_6px_rgba(239,68,68,1)]"
                      : ""
                  }
                `}
              >
                <CiMail
                  className="font-semibold text-[rgba(0,0,0,0.5)]"
                  size={20}
                />
                <input
                  type="email"
                  placeholder="What is your e-mail?"
                  className="w-full bg-transparent outline-none text-[16px]"
                  {...register("email")}
                  disabled={isPending}
                />
                {isEmailValid && (
                  <GiCheckMark
                    className="font-semibold text-[#636AE8]"
                    size={20}
                  />
                )}
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs font-semibold -mt-3">
                  {errors.email.message}
                </p>
              )}
              <div
                className={`flex items-center gap-2 bg-[#eef2ff] p-3 rounded-2xl
                  ${
                    passwordValue
                      ? isPasswordValid
                        ? "border-2 border-[#636AE8] shadow-[0_0_6px_#636AE8]"
                        : "border-2 border-red-500 shadow-[0_0_6px_rgba(239,68,68,1)]"
                      : ""
                  }
                `}
              >
                <PiLockKeyThin
                  className="font-semibold text-[rgba(0,0,0,0.5)]"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full outline-none text-[16px] bg-transparent"
                  {...register("password")}
                  disabled={isPending}
                />
                {isPasswordValid ? (
                  <GiCheckMark
                    className="font-semibold text-[#636AE8]"
                    size={20}
                  />
                ) : showPassword ? (
                  <IoEye
                    className="font-semibold text-[rgba(0,0,0,0.5)] cursor-pointer"
                    size={20}
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <IoMdEyeOff
                    className="font-semibold text-[rgba(0,0,0,0.5)] cursor-pointer"
                    size={20}
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs font-semibold -mt-3">
                  {errors.password.message}
                </p>
              )}
              <div className="flex items-center justify-between text-[14px] font-inter">
                <label htmlFor="check" className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="remember"
                    id="check"
                    className="accent-[#636AE8]"
                  />
                  <span className="">Remember me</span>
                </label>
                <a href="/forgot-password" className="text-[#636AE8]">
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                disabled={!isValid || isPending}
                className={`flex items-center justify-center gap-2 p-3 w-full rounded-2xl text-white font-semibold transition-all duration-300 ${
                  isValid && !isPending
                    ? "bg-[#636AE8] hover:bg-[#4f56d6]"
                    : "bg-[#636AE8] opacity-70 cursor-not-allowed"
                }`}
              >
                {isPending ? (
                  <>
                    <ImSpinner2 className="animate-spin h-5 w-5" /> Logging
                    in...
                  </>
                ) : (
                  "Continue"
                )}
              </button>
              {apiError && (
                <div
                  className="text-red-500 text-sm text-center font-semibold"
                  role="alert"
                  aria-live="assertive"
                >
                  {apiError}
                </div>
              )}
            </form>
          )}
          <div className={`mt-[2rem]`}>
            <p className="text-[15px] text-center">
              Don't have an account?{" "}
              <Link
                href={AppAuthRoutes.SIGNUP}
                className="text-[#636ae8] font-semibold"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
