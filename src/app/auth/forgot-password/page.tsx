"use client";
import { useState, useEffect } from "react";
import { CiMail } from "react-icons/ci";
import { GiCheckMark } from "react-icons/gi";
import { ImSpinner2 } from "react-icons/im";
import { isValidEmail } from "@/helpers/validations/auth.validation";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function Login() {
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [apiError, setApiError] = useState("");

  const isFormValid = emailValid;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!emailValid) {
      setEmailTouched(true);
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}`, {
        email,
      });

      if (res.status === 200 || res.status === 201) {
        setShowTransition(true);
      } else {
        throw new Error("401");
      }
    } catch (error: any) {
      if (error.message === "401") {
        setApiError("Invalid email");
      } else {
        setApiError("Unable to connect. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="w-full md:flex  md:justify-center md:items-center  min-h-screen md:gap-[2rem] md:px-[3rem]  md:py-[2rem] md:flex-row p-[1rem] flex flex-col gap-[2.5rem] bg-white text-gray-900"
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
            <h2 className={`text-[32px] font-bold`}>Password Recovery</h2>
            <p className={`text-[20px] font-semibold text-[rgba(0,0,0,0.5)]`}>
              Recover using email
            </p>
          </div>

          {showTransition ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <p className={`text-center text-xl`}>
                A password reset link has been sent to your email. Check your
                inbox!
              </p>
              <p className={`text-center text-xl`}>
                If the email exists, you will receive a reset link shortly in
                your email.
              </p>
            </div>
          ) : (
            <form className={`flex flex-col gap-5`} onSubmit={handleSubmit}>
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
              Remebered your password?{" "}
              <a href="/auth/login" className="text-[#636ae8] font-semibold">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
