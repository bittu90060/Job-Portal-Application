import { useEffect, useState } from "react";
import React from "react";
import {
  Plus,
  BriefcaseBusiness,
  Users,
  Trash2,
  Pencil,
  X,
  ClipboardList,
} from "lucide-react";
import api, { getError } from "../api";
import { useAuth } from "../context/AuthContext";

const blank = {
  title: "",
  company: "",
  location: "",
  type: "Full-time",
  category: "Technology",
  salary: "",
  description: "",
  requirements: "",
};
export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  async function load() {
    try {
      const [j, a] = await Promise.all([
        api.get("/jobs/mine"),
        api.get("/applications/employer"),
      ]);
      setJobs(j.data.jobs);
      setApps(a.data.applications);
    } catch (e) {
      setError(getError(e));
    }
  }
  useEffect(() => {
    load();
  }, []);
  function startEdit(job) {
    setEditing(job._id);
    setForm({ ...blank, ...job });
    setShowForm(true);
    setNotice("");
  }
  function newJob() {
    setEditing("");
    setForm({ ...blank, company: user?.company || "" });
    setShowForm(true);
    setNotice("");
  }
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (editing) await api.put(`/jobs/${editing}`, form);
      else await api.post("/jobs", form);
      setNotice(editing ? "Job updated." : "Job published.");
      setShowForm(false);
      setEditing("");
      await load();
    } catch (err) {
      setError(getError(err));
    } finally {
      setBusy(false);
    }
  }
  async function remove(id) {
    if (!confirm("Delete this job and its applications?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      setNotice("Job deleted.");
      await load();
    } catch (e) {
      setError(getError(e));
    }
  }
  async function updateStatus(id, status) {
    try {
      await api.put(`/applications/${id}/status`, { status });
      setNotice("Applicant status updated.");
      await load();
    } catch (e) {
      setError(getError(e));
    }
  }
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  return (
    <main className="page-wrap wrap">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">EMPLOYER WORKSPACE</span>
          <h1>Hiring dashboard</h1>
          <p>
            Welcome, {user?.company || user?.name}. Find the right people for
            your team.
          </p>
        </div>
        <button className="btn btn-primary" onClick={newJob}>
          <Plus size={17} /> Post a job
        </button>
      </div>
      {error && <div className="alert error">{error}</div>}
      {notice && <div className="alert success">{notice}</div>}
      <div className="metric-grid">
        <Metric
          icon={<BriefcaseBusiness />}
          label="Your job listings"
          value={jobs.length}
        />
        <Metric icon={<Users />} label="Total applicants" value={apps.length} />
        <Metric
          icon={<ClipboardList />}
          label="Needs review"
          value={
            apps.filter((a) => ["Submitted", "Under Review"].includes(a.status))
              .length
          }
        />
      </div>
      {showForm && (
        <section className="panel editor-panel">
          <div className="panel-heading">
            <div>
              <h2>{editing ? "Edit job listing" : "Create a job listing"}</h2>
              <p>Clear details help candidates understand the opportunity.</p>
            </div>
            <button
              className="icon-button"
              onClick={() => setShowForm(false)}
              aria-label="Close"
            >
              <X />
            </button>
          </div>
          <form className="form-grid" onSubmit={save}>
            <label>
              Job title
              <input
                name="title"
                required
                value={form.title}
                onChange={change}
                placeholder="e.g. Frontend Developer"
              />
            </label>
            <label>
              Company
              <input
                name="company"
                required
                value={form.company}
                onChange={change}
              />
            </label>
            <label>
              Location
              <input
                name="location"
                required
                value={form.location}
                onChange={change}
                placeholder="City or Remote"
              />
            </label>
            <label>
              Job type
              <select name="type" value={form.type} onChange={change}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
                <option>Remote</option>
              </select>
            </label>
            <label>
              Category
              <input name="category" value={form.category} onChange={change} />
            </label>
            <label>
              Salary range
              <input
                name="salary"
                value={form.salary}
                onChange={change}
                placeholder="e.g. ₹6–9 LPA"
              />
            </label>
            <label className="span-two">
              Description
              <textarea
                name="description"
                required
                rows="5"
                value={form.description}
                onChange={change}
                placeholder="Describe the role and responsibilities…"
              />
            </label>
            <label className="span-two">
              Requirements
              <textarea
                name="requirements"
                rows="4"
                value={form.requirements}
                onChange={change}
                placeholder="Skills, experience, and qualifications…"
              />
            </label>
            <div className="form-actions span-two">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" disabled={busy}>
                {busy ? "Saving…" : editing ? "Save changes" : "Publish job"}
              </button>
            </div>
          </form>
        </section>
      )}
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Your job listings</h2>
            <p>Manage openings and review candidate interest.</p>
          </div>
        </div>
        {jobs.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Location</th>
                  <th>Applicants</th>
                  <th>Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((j) => (
                  <tr key={j._id}>
                    <td>
                      <strong>{j.title}</strong>
                      <small className="table-sub">{j.company}</small>
                    </td>
                    <td>{j.location}</td>
                    <td>{apps.filter((a) => a.job?._id === j._id).length}</td>
                    <td>{new Date(j.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-row">
                        <button
                          className="icon-button"
                          title="Edit"
                          onClick={() => startEdit(j)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          className="icon-button danger-icon"
                          title="Delete"
                          onClick={() => remove(j._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <BriefcaseBusiness size={30} />
            <h3>No listings yet</h3>
            <p>Post your first role to start receiving applications.</p>
            <button className="btn btn-primary" onClick={newJob}>
              Post a job
            </button>
          </div>
        )}
      </section>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Applicants</h2>
            <p>Review applications and update their status.</p>
          </div>
        </div>
        {apps.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Job</th>
                  <th>Applied</th>
                  <th>Resume</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {apps.map((a) => (
                  <tr key={a._id}>
                    <td>
                      <strong>{a.applicant?.name || "Candidate"}</strong>
                      <small className="table-sub">{a.applicant?.email}</small>
                    </td>
                    <td>{a.job?.title}</td>
                    <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td>
                      {a.resumeUrl ? (
                        <a
                          href={a.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-link"
                        >
                          View resume
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <span
                        className={`status status-${a.status.toLowerCase().replaceAll(" ", "-")}`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="compact-select"
                        value={a.status}
                        onChange={(e) => updateStatus(a._id, e.target.value)}
                      >
                        <option>Submitted</option>
                        <option>Under Review</option>
                        <option>Shortlisted</option>
                        <option>Rejected</option>
                        <option>Hired</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <Users size={30} />
            <h3>No applicants yet</h3>
            <p>Applications will appear here when candidates apply.</p>
          </div>
        )}
      </section>
    </main>
  );
}
function Metric({ icon, label, value }) {
  return (
    <div className="metric-card">
      <span className="metric-icon">{icon}</span>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
