import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// CONTEXT
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

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
import SimpleDashboard from "./pages/SimpleDashboard";
import SimpleSimulation from "./pages/SimpleSimulation";
import Doctor from "./pages/Doctor";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Support from "./pages/Support";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
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

          {/* Simple Dashboard (full-page layout, no Layout wrapper) */}
          <Route
            path="/dashboard/simple"
            element={
              <ProtectedRoute>
                <SimpleDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/simple/:mode"
            element={
              <ProtectedRoute>
                <SimpleSimulation />
              </ProtectedRoute>
            }
          />

          {/* Doctor, Reports, Settings, Support (with Layout) */}
          <Route
            path="/dashboard/doctor"
            element={
              <ProtectedRoute>
                <Layout>
                  <Doctor />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/reports"
            element={
              <ProtectedRoute>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/support"
            element={
              <ProtectedRoute>
                <Layout>
                  <Support />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* DEFAULT: redirect to login (auth will redirect to dashboard if already logged in) */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}
