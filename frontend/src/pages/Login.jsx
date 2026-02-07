import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { useAuth } from "../context/AuthContext";
import { Stethoscope, Mail, Lock, Activity } from "lucide-react";

export default function Login() {
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get("admin") === "1";
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const username = email.trim() || "";
    if (login(username, password)) {
      navigate("/dashboard", { replace: true });
      return;
    }
    setError("Invalid email/username or password. For testing use username and password: 12345");
  };

  const title = isAdmin ? "Admin Login" : "Sign in to ParaTrain";

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        {/* Decorative medical accent line */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 text-para-teal/80">
            <Activity className="w-8 h-8" strokeWidth={1.5} />
            <span className="text-xs font-medium tracking-widest uppercase">Clinical Training</span>
            <Activity className="w-8 h-8" strokeWidth={1.5} />
          </div>
        </div>

        <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Top accent strip */}
          <div className="h-1.5 bg-gradient-to-r from-para-teal via-para-teal-light to-para-teal" />

          <div className="p-8 md:p-10">
            {/* Icon and title */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-para-teal/10 flex items-center justify-center mb-4 ring-2 ring-para-teal/20">
                <Stethoscope className="w-7 h-7 text-para-teal" strokeWidth={1.8} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 text-center">
                {title}
              </h2>
              <p className="text-sm text-gray-500 mt-1.5 text-center">
                {isAdmin ? "Access the admin dashboard" : "Continue your medical training journey"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email or username</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.8} />
                  <input
                    type="text"
                    placeholder="Enter email or username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-para-teal focus:ring-2 focus:ring-para-teal/20 outline-none transition text-gray-900 placeholder:text-gray-400"
                    autoComplete="username"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.8} />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-para-teal focus:ring-2 focus:ring-para-teal/20 outline-none transition text-gray-900 placeholder:text-gray-400"
                    autoComplete="current-password"
                  />
                </div>
              </div>
              {error && (
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-para-teal text-white font-semibold hover:bg-para-teal-dark focus:ring-2 focus:ring-para-teal focus:ring-offset-2 transition shadow-md hover:shadow-lg active:scale-[0.99]"
              >
                Sign in
              </button>
            </form>

            {!isAdmin && (
              <p className="text-center text-gray-600 mt-6 text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="text-para-teal font-semibold hover:underline focus:outline-none focus:ring-2 focus:ring-para-teal/30 rounded">
                  Create account
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Trust line */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Secure login · Medical training platform
        </p>
      </div>
    </AuthLayout>
  );
}
