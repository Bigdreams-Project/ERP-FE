"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PiLockKeyThin } from "react-icons/pi";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { GiCheckMark } from "react-icons/gi";
import { ImSpinner2 } from "react-icons/im";
import { FaSpinner } from "react-icons/fa6";
import axios from "axios";
import { isPasswordSame, isValidPassword } from "@/helpers/validations/auth.validation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Login() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [confirmPassValid, setConfirmPassValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");
  const [confirmPassError, setConfirmPassError] = useState("");

  const isFormValid = passwordValid && confirmPassValid;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!passwordValid || !confirmPassValid) {
      setPasswordTouched(true);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}`, {
        password,
      });

      if (res.status === 200 || res.status === 201) {
        setShowTransition(true);
        setTimeout(() => router.push("/auth/login"), 1000);
      } else {
        throw new Error("401");
      }
    } catch (error: any) {
      if (error.message === "401") {
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
      {/* Logo */}
      <div
        className={`w-full md:w-[60%] flex  justify-between items-center md:flex-row`}
      >
        <img src="/Logo.png" alt="" />
      </div>
      {/* Form */}
      <div className="w-full md:w-[45%] md:px-[1rem] ">
        <div
          className="w-[100%] flex flex-col gap-[1rem]  p-[2rem] rounded-[1rem]  md:shadow-lg"
          style={{ boxShadow: "0rem 0rem 0.7rem rgba(0, 0, 0, 0.1)" }}
        >
          <div className="flex flex-col gap-1">
            <h2 className={`text-[32px] font-bold`}>
              {showTransition ? "Success!" : "Reset Password"}
            </h2>
            <p className={`text-[20px] font-semibold text-[rgba(0,0,0,0.5)]`}>
              {" "}
              {showTransition ? "" : "Update your password"}
            </p>
          </div>{" "}
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
                      password
                        ? passwordValid
                          ? "border-2 border-[#636AE8] shadow-[0_0_6px_#636AE8]"
                          : "border-2 border-red-500 shadow-[0_0_6px_rgba(239,68,68,1)]"
                        : ""
                    }`}
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

              <div
                className={`flex items-center gap-2 bg-[#eef2ff] p-3 rounded-2xl 
                    ${
                      confirmPassword
                        ? confirmPassValid
                          ? "border-2 border-[#636AE8] shadow-[0_0_6px_#636AE8]"
                          : "border-2 border-red-500 shadow-[0_0_6px_rgba(239,68,68,1)]"
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

                {/* check if  */}
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
          )}{" "}
        </div>
      </div>{" "}
    </div>
  );
}
