import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { hasPendingBiodata, isBiodataComplete } from "../utils/biodataStorage";
import { hasPendingDoctorProfile, isDoctorProfileComplete } from "../utils/doctorProfileStorage";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role === "patient" && hasPendingBiodata() && !isBiodataComplete() && pathname !== "/dashboard/biodata") {
    return <Navigate to="/dashboard/biodata" replace />;
  }

  if (role === "doctor" && hasPendingDoctorProfile() && !isDoctorProfileComplete() && pathname !== "/dashboard/doctor-profile") {
    return <Navigate to="/dashboard/doctor-profile" replace />;
  }

  return children;
}
