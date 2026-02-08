import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import axios from "axios";
import { apiUrl, API_BASE } from "../api.js";

export default function Signup() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isDoctor = searchParams.get("doctor") === "1";

  const [step, setStep] = useState(1); // 1 = details, 2 = otp
  const [name, setName] = useState("");
  const [gmail, setGmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- SEND OTP ----------------
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!name || !gmail || !phone || !password || !confirmPassword) {
      setMessage("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(apiUrl("/api/auth/send-otp"), {
        email: gmail,
      });

      setStep(2);
      setMessage("OTP sent to your email.");
    } catch (err) {
      console.error("OTP error:", err.response?.data || err);
      const data = err.response?.data;
      // No response = backend not running or network error
      if (!err.response) {
        setMessage(
          `Cannot reach server at ${API_BASE}. Open a new terminal, run: cd backend  then  node server.js`
        );
        return;
      }
      const main = data?.error || "Failed to send OTP.";
      const debug = data?.debug;
      const reason = debug?.reason ? ` — ${debug.reason}` : "";
      const hint = debug?.hint ? ` (${debug.hint})` : "";
      setMessage(main + reason + hint);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- VERIFY OTP & CREATE ACCOUNT ----------------
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!otp) {
      setMessage("Please enter OTP.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(apiUrl("/api/auth/verify-otp"), {
        email: gmail,
        otp,
        name,
        phone,
        password,
      });

      setMessage("Account created successfully. Redirecting to login...");
      setStep(1);
      setName("");
      setGmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setOtp("");
      setTimeout(() => {
        navigate(isDoctor ? "/login/doctor" : "/login", { replace: true });
      }, 1500);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout showNav={true}>
      <div className="w-full max-w-md flex flex-col">
        <div className="relative bg-white rounded-2xl shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden animate-scaleIn">
          <div className="h-1.5 bg-gradient-to-r from-para-teal via-para-teal-light to-para-navy" />
          <div className="p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {isDoctor ? "Create Doctor Account" : "Create a New Account"}
            </h2>

            {/* -------- STEP 1 : DETAILS -------- */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-para-teal focus:ring-2 focus:ring-para-teal/20 outline-none transition"
                />
                <input
                  type="email"
                  placeholder="Gmail"
                  value={gmail}
                  onChange={(e) => setGmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-para-teal focus:ring-2 focus:ring-para-teal/20 outline-none transition"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-para-teal focus:ring-2 focus:ring-para-teal/20 outline-none transition"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-para-teal focus:ring-2 focus:ring-para-teal/20 outline-none transition"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-para-teal focus:ring-2 focus:ring-para-teal/20 outline-none transition"
                />

                {message && (
                  <p className="text-sm bg-para-teal/10 text-para-navy px-3 py-2 rounded-xl border border-para-teal/20">
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-para-teal to-para-teal-dark text-white font-semibold hover:from-para-teal-dark hover:to-para-navy transition-all duration-200 shadow-lg disabled:opacity-60"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            )}

            {/* -------- STEP 2 : OTP -------- */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-para-teal focus:ring-2 focus:ring-para-teal/20 outline-none transition"
                />

                {message && (
                  <p className="text-sm bg-para-teal/10 text-para-navy px-3 py-2 rounded-xl border border-para-teal/20">
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-para-teal to-para-teal-dark text-white font-semibold hover:from-para-teal-dark hover:to-para-navy transition-all duration-200 shadow-lg disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify & Create Account"}
                </button>
              </form>
            )}

            <p className="text-gray-600 mt-5 text-sm">
              Already have an account?{" "}
              <Link
                to={isDoctor ? "/login/doctor" : "/login"}
                className="text-para-teal font-medium underline"
              >
                Login here
              </Link>
            </p>
          </div>
        </div>

        <footer className="mt-8 py-6 text-center text-sm text-gray-500 border-t border-gray-200">
          <p>© 2025 ParaTrain. All rights reserved.</p>
        </footer>
      </div>
    </AuthLayout>
  );
}
