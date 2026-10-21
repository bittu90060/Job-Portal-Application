import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BriefcaseBusiness, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getError } from "../api";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = await login(form);
      navigate(
        location.state?.from ||
          (user.role === "admin"
            ? "/admin"
            : user.role === "employer"
              ? "/employer"
              : "/seeker"),
        { replace: true },
      );
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-icon">
            <BriefcaseBusiness />
          </span>
          <span>Welcome back</span>
        </div>
        <h1>Log in to JobBridge</h1>
        <p className="muted">Pick up where your career journey left off.</p>
        {error && <div className="alert error">{error}</div>}
        <form className="form-stack" onSubmit={submit}>
          <label>
            Email address
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label>
            Password
            <div className="password-wrap">
              <input
                type={show ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label="Toggle password visibility"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>
          <button className="btn btn-primary btn-full" disabled={busy}>
            {busy ? "Logging in…" : "Log in"}
          </button>
        </form>
        <p className="auth-switch">
          New to JobBridge? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
