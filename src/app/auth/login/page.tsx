"use client";
import {
  isValidEmail,
  isValidPassword,
} from "@/helpers/validations/auth.validation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CiMail } from "react-icons/ci";
import { FaSpinner } from "react-icons/fa6";
import { GiCheckMark } from "react-icons/gi";
import { ImSpinner2 } from "react-icons/im";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { PiLockKeyThin } from "react-icons/pi";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");

  const isFormValid = emailValid && passwordValid;

  // Handling real time validation
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
  }, [password, passwordTouched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!emailValid || !passwordValid) {
      setEmailTouched(true);
      setPasswordTouched(true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setShowTransition(true);
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        throw new Error(data.message || "401");
      }
    } catch (error: any) {
      if (
        error.message === "401" ||
        error.message === "Invalid email or password."
      ) {
        setApiError("Invalid email or password.");
      } else {
        setApiError("Unable to connect. Please try again.");
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
      {/* Logo */}
      <div
        className={`w-full md:w-[60%] flex  justify-between items-center md:flex-row`}
      >
        <img src="/Logo.png" alt="" />
      </div>

      {/* Form */}
      <div className="w-full md:w-[45%] md:px-[1rem] ">
        <div
          className="w-[100%] flex flex-col gap-[2rem]  p-[2rem] rounded-[1rem]  md:shadow-lg"
          style={{ boxShadow: "0rem 0rem 0.7rem rgba(0, 0, 0, 0.1)" }}
        >
          <div className="flex flex-col gap-1">
            <h2 className="text-[32px] font-bold">Welcome Back 👋</h2>
            <p className="">Login to your account</p>
          </div>

          {showTransition ? (
            <div className="flex flex-col items-center justify-center py-10 gap-4">
              <FaSpinner className="animate-spin text-[#636AE8] text-4xl" />
              <p className="text-gray-500 font-medium text-sm">
                Just a second...
              </p>
            </div>
          ) : (
            <form className={`flex flex-col gap-5`} onSubmit={handleSubmit}>
              <div
                className={`flex items-center gap-2 bg-[#eef2ff] p-3 rounded-2xl 
                  ${
                    email
                      ? emailValid
                        ? "border-2 border-[#636AE8] shadow-[0_0_6px_rgba(34,197,94,0.6)]"
                        : "border-2 border-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]"
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
                        ? "border-2 border-[#636AE8] shadow-[0_0_6px_rgba(34,197,94,0.6)]"
                        : "border-2 border-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]"
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
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordTouched) setPasswordError("");
                    if (apiError) setApiError("");
                  }}
                  onBlur={() => setPasswordTouched(true)}
                  disabled={loading}
                />

                {/* check if  */}
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

              {/* Submit button */}
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
          )}

          <div className={`mt-[2rem]`}>
            <p className="text-[15px] text-center">
              Don't have an account?{" "}
              <a href="/sign-up" className="text-[#636ae8] font-semibold">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
