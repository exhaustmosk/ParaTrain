import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// CONTEXT
import { AuthProvider } from "./context/AuthContext";

// COMPONENTS
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// PAGES
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Arms from "./pages/Dashboard/Arms";
import Legs from "./pages/Dashboard/Legs";
import Wrists from "./pages/Dashboard/Wrists";
import FullBody from "./pages/Dashboard/FullBody";
import AllSimulations from "./pages/Dashboard/Simulations";
import SimulationModes from "./pages/Dashboard/SimulationModes";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* AUTH ROUTES (no sidebar) */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* PROTECTED DASHBOARD ROUTES */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/simulation-modes"
            element={
              <ProtectedRoute>
                <Layout>
                  <SimulationModes />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/simulations"
            element={
              <ProtectedRoute>
                <Layout>
                  <AllSimulations />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/arms"
            element={
              <ProtectedRoute>
                <Layout>
                  <Arms title="Arms" difficulty="High" />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/legs"
            element={
              <ProtectedRoute>
                <Layout>
                  <Legs />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/wrists"
            element={
              <ProtectedRoute>
                <Layout>
                  <Wrists />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/fullbody"
            element={
              <ProtectedRoute>
                <Layout>
                  <FullBody />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* DEFAULT: redirect to login (auth will redirect to dashboard if already logged in) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
