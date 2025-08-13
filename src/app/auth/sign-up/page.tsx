"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { CiMail } from "react-icons/ci";
import { PiLockKeyThin } from "react-icons/pi";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { GiCheckMark } from "react-icons/gi";
import { ImSpinner2 } from "react-icons/im";
import { CiUser } from "react-icons/ci";
import { RiBuilding4Line } from "react-icons/ri";
import { IoBriefcaseOutline } from "react-icons/io5";
import {
  isPasswordSame,
  isValidEmail,
  isValidPassword,
} from "@/helpers/validations/auth.validation";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Login() {
  const router = useRouter();

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [company, setCompany] = useState("Tecterminal");
  const [job, setJob] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [jobTouched, setJobTouched] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmPassValid, setConfirmPassValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");
  const [confirmPassError, setConfirmPassError] = useState("");
  const [jobError, setJobError] = useState("");

  const isFormValid =
    emailValid && passwordValid && confirmPassValid && fullname && job;

  useEffect(() => {
    if (!fullname && !nameTouched) {
      setNameError("");
    } else if (nameTouched && !fullname) {
      setNameError("Please enter your full name");
    } else {
      setNameError("");
    }
  });

  useEffect(() => {
    setEmailValid(isValidEmail(email));
    if (!email && emailTouched) {
      setEmailError("");
    } else if (emailTouched && !isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  }, [email, emailTouched]);

  useEffect(() => {
    setPasswordValid(isValidPassword(password));
    if (!password && passwordTouched) {
      setPasswordError("");
    } else if (passwordTouched && !isValidPassword(password)) {
      setPasswordError(
        "Password must have at least 8 characters, including uppercase, lowercase, number, and symbol."
      );
    } else {
      setPasswordError("");
    }
  }, [password, passwordTouched, confirmPassword]);

  useEffect(() => {
    setConfirmPassValid(isPasswordSame(password, confirmPassword));
    if (!confirmPassword && passwordTouched) {
      setConfirmPassError("");
    } else if (confirmPassword && !isPasswordSame(password, confirmPassword)) {
      setConfirmPassError("Passwords do not match");
    } else {
      setConfirmPassError("");
    }
  });

  useEffect(() => {
    if (!job && !jobTouched) {
      setJobError("");
    } else if (jobTouched && !job) {
      setJobError("Please fill in your job position");
    } else {
      setJobError("");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!emailValid || !passwordValid || !confirmPassValid) {
      setEmailTouched(true);
      setPasswordTouched(true);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}`, {
        fullname,
        email,
        password,
        company,
        job,
      });

      if (res.status === 201 || res.status === 200) {
        setShowTransition(true);
      } else {
        throw new Error("401");
      }
    } catch (error: any) {
      if (error.message === "401" || error.message === "Signup Failed") {
        setApiError("Signup Failed");
      } else {
        setApiError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full md:flex  md:justify-center md:items-center  min-h-screen md:gap-[2rem] md:px-[3rem]  md:py-[2rem] md:flex-row p-[1rem] flex flex-col gap-[2.5rem]"
      style={{}}
    >
      
      <div
        className={`w-full md:w-[60%] flex  justify-between items-center md:flex-row`}
      >
        <img src="/Logo.png" alt="" />
      </div>

      <div className="w-full md:w-[45%] md:px-[1rem] ">
        <div
          className="w-[100%] flex flex-col gap-[1rem]  p-[2rem] rounded-[1rem]  md:shadow-lg"
          style={{ boxShadow: "0rem 0rem 0.7rem rgba(0, 0, 0, 0.1)" }}
        >
          <div className="flex flex-col gap-1">
            <h2 className={`text-[32px] font-bold`}>
              {showTransition ? "Thank You!" : "Welcome Back 👋"}
            </h2>
            <p className={`text-[20px] font-semibold text-[rgba(0,0,0,0.5)]`}>
              {" "}
              {showTransition ? "" : "Register an account"}
            </p>
          </div>{" "}
          {showTransition ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <div
                className={`max-w-md w-full bg-white p-6 rounded  text-center space-y-4`}
              >
                <p className="text-l font-bold ">
                  Your access request has been sent. An administrator will
                  review and approve your account shortly.
                </p>
                <a
                  href="/login"
                  className="bg-[#636AE8] text-white pt-3 pb-3 pl-4 pr-4 rounded hover:bg-[#1e26c8ff]"
                >
                  Return to Sign In
                </a>
              </div>
            </div>
          ) : (
            <form className={`flex flex-col gap-5`} onSubmit={handleSubmit}>
              <div
                className={`flex items-center gap-2 bg-[#eef2ff] p-3 rounded-2xl`}
              >
                <CiUser
                  className="font-semibold text-[rgba(0,0,0,0.5)]"
                  size={20}
                />

                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full bg-transparent outline-none text-[16px]"
                  value={fullname}
                  onChange={(e) => {
                    setFullname(e.target.value);
                    if (nameTouched) setNameError("");
                    if (apiError) setApiError("");
                  }}
                  onBlur={() => setNameTouched(true)}
                  disabled={loading}
                />
              </div>
              {nameError && (
                <p className="text-red-500 text-xs font-semibold -mt-3">
                  {nameError}
                </p>
              )}

              <div
                className={`flex items-center gap-2 bg-[#eef2ff] p-3 rounded-2xl 
                    ${
                      email
                        ? emailValid
                          ? "border-2 border-[#636AE8] shadow-[0_0_6px_#636AE8]"
                          : "border-2 border-red-500 shadow-[0_0_6px_rgba(239,68,68,1)]"
                        : ""
                    }`}
              >
                <CiMail
                  className="font-semibold text-[rgba(0,0,0,0.5)]"
                  size={20}
                />

                <input
                  type="email"
                  placeholder="What is your e-mail?"
                  className="w-full bg-transparent outline-none text-[16px]"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailTouched) setEmailError("");
                    if (apiError) setApiError("");
                  }}
                  onBlur={() => setEmailTouched(true)}
                  disabled={loading}
                />

                {isValidEmail(email) && (
                  <GiCheckMark
                    className="font-semibold text-[#636AE8]"
                    size={20}
                  />
                )}
              </div>

              {emailError && (
                <p className="text-red-500 text-xs font-semibold -mt-3">
                  {emailError}
                </p>
              )}

              <div
                className={`flex items-center gap-2 bg-[#eef2ff] p-3 rounded-2xl 
                    ${
                      password
                        ? passwordValid
                          ? "border-2 border-[#636AE8] shadow-[0_0_6px_#636AE8]"
                          : "border-2 border-red-500 shadow-[0_0_6px_rgba(239,68,68,1)]"
                        : ""
                    }`}
              >
                <PiLockKeyThin
                  className="font-semibold text-[rgba(172, 16, 16, 0.5)]"
                  size={20}
                />

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full outline-none text-[16px] bg-transparent"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordTouched) setPasswordError("");
                    if (apiError) setApiError("");
                  }}
                  onBlur={() => setPasswordTouched(true)}
                  disabled={loading}
                />

                {isValidPassword(password) ? (
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

              {passwordError && (
                <p className="text-red-500 text-xs font-semibold -mt-3">
                  {passwordError}
                </p>
              )}

              <div
                className={`flex items-center gap-2 bg-[#eef2ff] p-3 rounded-2xl 
                    ${
                      confirmPassword
                        ? confirmPassValid
                          ? "border-2 border-[#636AE8] shadow-[0_0_6px_#636AE8]"
                          : "border-2 border-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]"
                        : ""
                    }`}
              >
                <PiLockKeyThin
                  className="font-semibold text-[rgba(0,0,0,0.5)]"
                  size={20}
                />

                <input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full outline-none text-[16px] bg-transparent"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordTouched) setConfirmPassError("");
                    if (apiError) setApiError("");
                  }}
                  onBlur={() => setPasswordTouched(true)}
                  disabled={loading}
                />

                {isPasswordSame(password, confirmPassword) ? (
                  <GiCheckMark
                    className="font-semibold text-[#636AE8]"
                    size={20}
                  />
                ) : showConfirmPass ? (
                  <IoEye
                    className="font-semibold text-[rgba(0,0,0,0.5)] cursor-pointer"
                    size={20}
                    onClick={() => setShowConfirmPass(false)}
                  />
                ) : (
                  <IoMdEyeOff
                    className="font-semibold text-[rgba(0,0,0,0.5)] cursor-pointer"
                    size={20}
                    onClick={() => setShowConfirmPass(true)}
                  />
                )}
              </div>

              {confirmPassError && (
                <p className="text-red-500 text-xs font-semibold -mt-3">
                  {confirmPassError}
                </p>
              )}

              <div
                className={`flex items-center gap-2 bg-[#eef2ff] p-3 rounded-2xl`}
              >
                <RiBuilding4Line
                  className="font-semibold text-[rgba(0,0,0,0.5)]"
                  size={20}
                />

                <input
                  type="text"
                  placeholder="Company/Organization name"
                  className="w-full bg-transparent outline-none text-[16px]"
                  value={company}
                  onChange={(e) => {
                    setCompany(e.target.value);
                  }}
                  disabled={loading}
                />
              </div>

              <div
                className={`flex items-center gap-2 bg-[#eef2ff] p-3 rounded-2xl`}
              >
                <IoBriefcaseOutline
                  className="font-semibold text-[rgba(0,0,0,0.5)]"
                  size={20}
                />

                <input
                  type="text"
                  placeholder="Job title (Optional)"
                  className="w-full bg-transparent outline-none text-[16px]"
                  value={job}
                  onChange={(e) => {
                    setJob(e.target.value);
                    if (jobTouched) setJobError("");
                    if (apiError) setApiError("");
                  }}
                  onBlur={() => setJobTouched(true)}
                  disabled={loading}
                />
              </div>
              {jobError && (
                <p className="text-red-500 text-xs font-semibold -mt-3">
                  {jobError}
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
              </div>

              <button
                type="submit"
                disabled={!isFormValid || loading}
                className={`flex items-center justify-center gap-2 p-3 w-full rounded-2xl text-white font-semibold transition-all duration-300 ${
                  isFormValid && !loading
                    ? "bg-[#636AE8] hover:bg-[#4f56d6]"
                    : "bg-[#636AE8] opacity-70 cursor-not-allowed"
                }`}
              >
                {loading ? (
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
          )}{" "}
          {showTransition ? (
            ""
          ) : (
            <div className={`mt-[2rem]`}>
              <p className="text-[15px] text-center">
                Already have an account?{" "}
                <a href="/login" className="text-[#636ae8] font-semibold">
                  Login
                </a>
              </p>
            </div>
          )}
        </div>
      </div>{" "}
    </div>
  );
}
