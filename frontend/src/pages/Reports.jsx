import React from "react";
import { useNavigate } from "react-router-dom";

export default function Reports() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-para-bg p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium"
          >
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">AI Reports</h1>
        </div>
        <p className="text-gray-500">View and download your performance reports here. Full report history will be available in a future update.</p>
      </div>
    </div>
  );
}
