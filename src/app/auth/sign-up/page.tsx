"use client";
import { AppAuthRoutes } from "@/constants/appRoutes.constant";
import { registerUser } from "@/lib/auth/signup";
import { IRegisterUser } from "@/types/auth/signup.interface";
import { signupSchema } from "@/validations/auth/signup.validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CiMail, CiUser } from "react-icons/ci";
import { GiCheckMark } from "react-icons/gi";
import { ImSpinner2 } from "react-icons/im";
import { IoMdEyeOff } from "react-icons/io";
import { IoBriefcaseOutline, IoEye } from "react-icons/io5";
import { PiLockKeyThin } from "react-icons/pi";
import { RiBuilding4Line } from "react-icons/ri";

export default function Signup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<IRegisterUser>({
    resolver: yupResolver(signupSchema),
    mode: "onTouched",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      router.push(AppAuthRoutes.LOGIN);
    },
    onError: () => {
      setApiError("Invalid email or password.");
    },
  });

  const onSubmit = (data: IRegisterUser) => {
    setApiError("");
    console.log("Data:", data);
    mutate(data);
  };

  const watchPassword = watch("password");
  const watchConfirmPassword = watch("confirmPassword");
  const formReady = isDirty && isValid;

  return (
    <div className="w-full h-screen md:flex md:justify-center md:items-center min-h-screen md:gap-[2rem] md:px-[3rem] md:py-[2rem] md:flex-row p-[1rem] flex flex-col gap-[2.5rem]">
      {/* Logo */}
      <div className="w-full md:w-[60%] flex justify-between items-center md:flex-row">
        <img src="/Logo.png" alt="" />
      </div>

      {/* Form */}
      <div className="w-full md:w-[45%] md:px-[1rem] h-screen my-auto overflow-y-auto custom-scroll-white">
        <div
          className="w-full flex flex-col gap-[1rem] p-[2rem] rounded-[1rem] md:shadow-lg"
          style={{ boxShadow: "0rem 0rem 0.7rem rgba(0, 0, 0, 0.1)" }}
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-[32px] font-bold">
              {showTransition ? "Thank You!" : "Welcome Back 👋"}
            </h2>
            <p className="text-[20px] font-semibold text-[rgba(0,0,0,0.5)]">
              {showTransition ? "" : "Register an account"}
            </p>
          </div>

          {showTransition ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <div className="max-w-md w-full bg-white p-6 rounded text-center space-y-4">
                <p className="text-l font-bold">
                  Your access request has been sent. An administrator will
                  review and approve your account shortly.
                </p>
                <a
                  href="/login"
                  className="bg-[#636AE8] text-white pt-3 pb-3 px-4 rounded hover:bg-[#1e26c8ff]"
                >
                  Return to Sign In
                </a>
              </div>
            </div>
          ) : (
            <form
              className="flex flex-col gap-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* First Name */}
              <div className="flex items-center gap-2 bg-[#eef2ff] p-3 rounded-2xl">
                <CiUser className="text-[rgba(0,0,0,0.5)]" size={20} />
                <input
                  type="text"
                  placeholder="Enter your first name"
                  className="w-full bg-transparent outline-none text-[16px]"
                  {...register("firstname")}
                />
              </div>
              {errors.firstname && (
                <p className="text-red-500 text-xs font-semibold -mt-3">
                  {errors.firstname.message}
                </p>
              )}

              {/* Last Name */}
              <div className="flex items-center gap-2 bg-[#eef2ff] p-3 rounded-2xl">
                <CiUser className="text-[rgba(0,0,0,0.5)]" size={20} />
                <input
                  type="text"
                  placeholder="Enter your last name"
                  className="w-full bg-transparent outline-none text-[16px]"
                  {...register("lastname")}
                />
              </div>
              {errors.lastname && (
                <p className="text-red-500 text-xs font-semibold -mt-3">
                  {errors.lastname.message}
                </p>
              )}

              {/* Email */}
              <div
                className={`flex items-center gap-2 bg-[#eef2ff] p-3 rounded-2xl ${
                  watch("email")
                    ? errors.email
                      ? "border-2 border-red-500 shadow-[0_0_6px_rgba(239,68,68,1)]"
                      : "border-2 border-[#636AE8] shadow-[0_0_6px_#636AE8]"
                    : ""
                }`}
              >
                <CiMail className="text-[rgba(0,0,0,0.5)]" size={20} />
                <input
                  type="email"
                  placeholder="What is your e-mail?"
                  className="w-full bg-transparent outline-none text-[16px]"
                  {...register("email")}
                />
                {!errors.email && watch("email") && (
                  <GiCheckMark className="text-[#636AE8]" size={20} />
                )}
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs font-semibold -mt-3">
                  {errors.email.message}
                </p>
              )}

              {/* Password */}
              <div
                className={`flex items-center gap-2 bg-[#eef2ff] p-3 rounded-2xl ${
                  watchPassword
                    ? errors.password
                      ? "border-2 border-red-500 shadow-[0_0_6px_rgba(239,68,68,1)]"
                      : "border-2 border-[#636AE8] shadow-[0_0_6px_#636AE8]"
                    : ""
                }`}
              >
                <PiLockKeyThin className="text-[rgba(0,0,0,0.5)]" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full outline-none text-[16px] bg-transparent"
                  {...register("password")}
                />
                {errors.password ? (
                  showPassword ? (
                    <IoEye
                      className="text-[rgba(0,0,0,0.5)] cursor-pointer"
                      size={20}
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <IoMdEyeOff
                      className="text-[rgba(0,0,0,0.5)] cursor-pointer"
                      size={20}
                      onClick={() => setShowPassword(true)}
                    />
                  )
                ) : (
                  <GiCheckMark className="text-[#636AE8]" size={20} />
                )}
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs font-semibold -mt-3">
                  {errors.password.message}
                </p>
              )}

              {/* Confirm Password */}
              <div
                className={`flex items-center gap-2 bg-[#eef2ff] p-3 rounded-2xl ${
                  watchConfirmPassword
                    ? errors.confirmPassword
                      ? "border-2 border-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]"
                      : "border-2 border-[#636AE8] shadow-[0_0_6px_#636AE8]"
                    : ""
                }`}
              >
                <PiLockKeyThin className="text-[rgba(0,0,0,0.5)]" size={20} />
                <input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full outline-none text-[16px] bg-transparent"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword ? (
                  showConfirmPass ? (
                    <IoEye
                      className="text-[rgba(0,0,0,0.5)] cursor-pointer"
                      size={20}
                      onClick={() => setShowConfirmPass(false)}
                    />
                  ) : (
                    <IoMdEyeOff
                      className="text-[rgba(0,0,0,0.5)] cursor-pointer"
                      size={20}
                      onClick={() => setShowConfirmPass(true)}
                    />
                  )
                ) : (
                  watchConfirmPassword && (
                    <GiCheckMark className="text-[#636AE8]" size={20} />
                  )
                )}
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs font-semibold -mt-3">
                  {errors.confirmPassword.message}
                </p>
              )}

              {/* Company */}
              <div className="flex items-center gap-2 bg-[#eef2ff] p-3 rounded-2xl">
                <RiBuilding4Line className="text-[rgba(0,0,0,0.5)]" size={20} />
                <input
                  type="text"
                  placeholder="Company/Organization name"
                  className="w-full bg-transparent outline-none text-[16px]"
                  {...register("company")}
                />
              </div>

              {/* Job */}
              <div className="flex items-center gap-2 bg-[#eef2ff] p-3 rounded-2xl">
                <IoBriefcaseOutline
                  className="text-[rgba(0,0,0,0.5)]"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Job title (Optional)"
                  className="w-full bg-transparent outline-none text-[16px]"
                  {...register("job")}
                />
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-[14px] font-inter">
                <label htmlFor="check" className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    id="check"
                    className="accent-[#636AE8]"
                  />
                  <span>Remember me</span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!formReady || isPending}
                className={`flex items-center justify-center gap-2 p-3 w-full rounded-2xl text-white font-semibold transition-all duration-300 ${
                  formReady && !isPending
                    ? "bg-[#636AE8] hover:bg-[#4f56d6]"
                    : "bg-[#636AE8] opacity-70 cursor-not-allowed"
                }`}
              >
                {isPending ? (
                  <>
                    <ImSpinner2 className="animate-spin h-5 w-5" /> Signing
                    up...
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

          {!showTransition && (
            <div className="mt-[2rem]">
              <p className="text-[15px] text-center">
                Already have an account?{" "}
                <a
                  href={AppAuthRoutes.LOGIN}
                  className="text-[#636ae8] font-semibold"
                >
                  Login
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
