import { useEffect, useState } from "react";
import React from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Clock3,
  Building2,
  CheckCircle2,
} from "lucide-react";
import api, { getError } from "../api";
import { useAuth } from "../context/AuthContext";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    api
      .get(`/jobs/${id}`)
      .then((r) => setJob(r.data.job))
      .catch((e) => setError(getError(e)));
  }, [id]);
  async function apply(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api.post(`/applications/${id}`, {
        coverLetter: e.currentTarget.coverLetter.value,
        resumeUrl: e.currentTarget.resumeUrl.value,
      });
      setNotice("Your application was submitted successfully.");
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  }
  if (error && !job)
    return (
      <main className="page-wrap wrap">
        <div className="alert error">{error}</div>
        <Link to="/jobs" className="text-link">
          Back to jobs
        </Link>
      </main>
    );
  if (!job) return <div className="page-loading">Loading job details…</div>;
  return (
    <main className="page-wrap wrap detail-page">
      <Link to="/jobs" className="back-link">
        <ArrowLeft size={16} /> Back to jobs
      </Link>
      <div className="detail-layout">
        <section className="detail-main">
          <div className="detail-heading">
            <div className="company-mark large">
              <Building2 size={28} />
            </div>
            <span className="pill">{job.type}</span>
            <h1>{job.title}</h1>
            <p className="company-name">{job.company}</p>
            <div className="job-meta">
              <span>
                <MapPin size={16} />
                {job.location}
              </span>
              <span>
                <Clock3 size={16} />
                {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="detail-section">
            <h2>About this role</h2>
            <p className="preserve-lines">{job.description}</p>
          </div>
          {job.requirements && (
            <div className="detail-section">
              <h2>What you’ll bring</h2>
              <p className="preserve-lines">{job.requirements}</p>
            </div>
          )}
        </section>
        <aside className="apply-card">
          <span className="eyebrow">THE OPPORTUNITY</span>
          <h2>{job.salary || "Salary not disclosed"}</h2>
          <p className="muted">
            Compensation details as provided by the employer.
          </p>
          {notice && (
            <div className="alert success">
              <CheckCircle2 size={17} />
              {notice}
            </div>
          )}
          {error && <div className="alert error">{error}</div>}
          {!user ? (
            <>
              <p className="muted">Log in as a job seeker to apply.</p>
              <button
                className="btn btn-primary btn-full"
                onClick={() => navigate("/login")}
              >
                Log in to apply
              </button>
            </>
          ) : user.role === "seeker" ? (
            <form className="form-stack" onSubmit={apply}>
              <label>
                Cover letter <span className="optional">(optional)</span>
                <textarea
                  name="coverLetter"
                  rows="4"
                  maxLength="5000"
                  placeholder="Tell the employer why you're a great fit…"
                />
              </label>
              <label>
                Resume URL <span className="optional">(optional)</span>
                <input name="resumeUrl" type="url" placeholder="https://…" />
              </label>
              <button
                className="btn btn-primary btn-full"
                disabled={busy || !!notice}
              >
                {busy
                  ? "Submitting…"
                  : notice
                    ? "Application submitted"
                    : "Apply for this job"}
              </button>
              <small className="muted">
                Use a shareable resume link. Never include sensitive personal
                data in public links.
              </small>
            </form>
          ) : (
            <p className="muted">
              Applications are available to job seeker accounts.
            </p>
          )}
        </aside>
      </div>
    </main>
  );
}
