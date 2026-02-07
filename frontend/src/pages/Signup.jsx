import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

export default function Signup() {
  const [name, setName] = useState("");
  const [gmail, setGmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    // Placeholder for backend OTP flow
    setMessage("OTP flow will be connected when backend is ready. You can log in with 12345 / 12345 for now.");
  };

  return (
    <AuthLayout showNav={true}>
      <div className="w-full max-w-md flex flex-col">
        <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-para-teal via-para-teal-light to-para-teal" />
          <div className="p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Create a New Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <p className="text-sm text-gray-700 bg-para-teal/10 text-para-navy px-3 py-2 rounded-xl border border-para-teal/20">
                {message}
              </p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-para-teal text-white font-semibold hover:bg-para-teal-dark transition"
            >
              Send OTP
            </button>
          </form>
          <p className="text-gray-600 mt-5 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-para-teal font-medium underline">
              Login here
            </Link>
          </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 py-6 text-center text-sm text-gray-500 border-t border-gray-200">
          <p>© 2025 ParaTrain. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <Link to="#" className="text-para-teal hover:underline">Need support?</Link>
            <span>|</span>
            <Link to="#" className="text-para-teal hover:underline">Refund Policy</Link>
            <span>|</span>
            <Link to="#" className="text-para-teal hover:underline">Terms & Conditions</Link>
            <span>|</span>
            <Link to="#" className="text-para-teal hover:underline">Privacy Policy</Link>
          </div>
        </footer>
      </div>
    </AuthLayout>
  );
}
