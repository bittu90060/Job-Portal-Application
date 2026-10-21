import React from "react";
import { useEffect, useState } from "react";
import {
  Users,
  BriefcaseBusiness,
  FileText,
  UserRound,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import api, { getError } from "../api";


export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    employers: 0,
    seekers: 0,
    jobs: 0,
    applications: 0,
  });
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  async function load() {
    try {
      const [s, u, j] = await Promise.all([
        api.get("/admin/dashboard"),
        api.get("/admin/users"),
        api.get("/admin/jobs"),
      ]);
      setStats(s.data.stats);
      setUsers(u.data.users);
      setJobs(j.data.jobs);
    } catch (e) {
      setError(getError(e));
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function deleteUser(id) {
    if (!confirm("Delete this user and their related jobs/applications?"))
      return;
    try {
      await api.delete(`/admin/users/${id}`);
      setNotice("User deleted.");
      await load();
    } catch (e) {
      setError(getError(e));
    }
  }
  async function deleteJob(id) {
    if (!confirm("Delete this job and its applications?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      setNotice("Job deleted.");
      await load();
    } catch (e) {
      setError(getError(e));
    }
  }
  return (
    <main className="page-wrap wrap">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">PLATFORM CONTROL</span>
          <h1>Admin dashboard</h1>
          <p>Monitor the JobBridge community and manage platform content.</p>
        </div>
        <span className="admin-badge">
          <ShieldCheck size={17} /> Administrator
        </span>
      </div>
      {error && <div className="alert error">{error}</div>}
      {notice && <div className="alert success">{notice}</div>}
      <div className="metric-grid five">
        <Metric icon={<Users />} label="All users" value={stats.users} />
        <Metric
          icon={<UserRound />}
          label="Job seekers"
          value={stats.seekers}
        />
        <Metric
          icon={<BriefcaseBusiness />}
          label="Employers"
          value={stats.employers}
        />
        <Metric
          icon={<BriefcaseBusiness />}
          label="Job listings"
          value={stats.jobs}
        />
        <Metric
          icon={<FileText />}
          label="Applications"
          value={stats.applications}
        />
      </div>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Platform users</h2>
            <p>Manage registered seekers and employers.</p>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <strong>{u.name}</strong>
                    {u.company && (
                      <small className="table-sub">{u.company}</small>
                    )}
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className="pill">{u.role}</span>
                  </td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    {u.role !== "admin" && (
                      <button
                        className="icon-button danger-icon"
                        title="Delete user"
                        onClick={() => deleteUser(u._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>All job listings</h2>
            <p>Review and remove inappropriate or outdated listings.</p>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Job</th>
                <th>Company</th>
                <th>Employer</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
                <tr key={j._id}>
                  <td>
                    <strong>{j.title}</strong>
                  </td>
                  <td>{j.company}</td>
                  <td>{j.employer?.email || "—"}</td>
                  <td>{j.location}</td>
                  <td>
                    <button
                      className="icon-button danger-icon"
                      title="Delete job"
                      onClick={() => deleteJob(j._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
