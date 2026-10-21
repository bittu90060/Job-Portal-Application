import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BriefcaseBusiness } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getError } from "../api";

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "seeker",
    company: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const user = await register(form);
      navigate(user.role === "employer" ? "/employer" : "/seeker");
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
          <span>Your next chapter</span>
        </div>
        <h1>Create your account</h1>
        <p className="muted">
          Join a community built around your next opportunity.
        </p>
        {error && <div className="alert error">{error}</div>}
        <form className="form-stack" onSubmit={submit}>
          <label>
            Full name
            <input
              name="name"
              required
              minLength="2"
              placeholder="Your full name"
              value={form.name}
              onChange={change}
            />
          </label>
          <label>
            Email address
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={change}
            />
          </label>
          <label>
            I want to
            <select name="role" value={form.role} onChange={change}>
              <option value="seeker">Find a job</option>
              <option value="employer">Hire great people</option>
            </select>
          </label>
          {form.role === "employer" && (
            <label>
              Company name
              <input
                name="company"
                required
                placeholder="Your company"
                value={form.company}
                onChange={change}
              />
            </label>
          )}
          <label>
            Password
            <input
              name="password"
              type="password"
              required
              minLength="8"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={change}
            />
          </label>
          <button className="btn btn-primary btn-full" disabled={busy}>
            {busy ? "Creating account…" : "Create account"}
          </button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}
