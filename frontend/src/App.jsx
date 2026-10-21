import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SeekerDashboard from "./pages/SeekerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function DashboardRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <div className="page-loading">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return (
    <Navigate
      to={
        user.role === "admin"
          ? "/admin"
          : user.role === "employer"
            ? "/employer"
            : "/seeker"
      }
      replace
    />
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <Link to="/" className="brand">
          <span className="brand-icon">
            <span>J</span>
          </span>
          JobBridge<span className="brand-dot">.</span>
        </Link>
        <p>Helping people find work that moves them forward.</p>
        <span>
          © {new Date().getFullYear()} JobBridge. Built for opportunity.
        </span>
      </div>
    </footer>
  );
}

function AppLayout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardRedirect />} />
        <Route
          path="/seeker"
          element={
            <ProtectedRoute roles={["seeker"]}>
              <SeekerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer"
          element={
            <ProtectedRoute roles={["employer"]}>
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <main className="empty-state wrap">
              <h1>Page not found</h1>
              <Link to="/" className="btn btn-primary">
                Go home
              </Link>
            </main>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}
