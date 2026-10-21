import React, { useEffect, useState } from "react";


import {
  BriefcaseBusiness,
  Clock3,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { Link } from "react-router-dom";
import api, { getError } from "../api";
import { useAuth } from "../context/AuthContext";

export default function SeekerDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api
      .get("/applications/my")
      .then((r) => setApplications(r.data.applications))
      .catch((e) => setError(getError(e)))
      .finally(() => setLoading(false));
  }, []);
  const shortlisted = applications.filter(
    (a) => a.status === "Shortlisted" || a.status === "Hired",
  ).length;
  return (
    <main className="page-wrap wrap">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow">YOUR CAREER SPACE</span>
          <h1>Welcome back, {user?.name?.split(" ")[0]}</h1>
          <p>Keep your search moving and follow your applications.</p>
        </div>
        <Link to="/jobs" className="btn btn-primary">
          <BriefcaseBusiness size={17} /> Find jobs
        </Link>
      </div>
      <div className="metric-grid">
        <Metric
          icon={<FileText />}
          label="Applications"
          value={applications.length}
        />
        <Metric
          icon={<Clock3 />}
          label="In review"
          value={
            applications.filter(
              (a) => a.status === "Submitted" || a.status === "Under Review",
            ).length
          }
        />
        <Metric
          icon={<CheckCircle2 />}
          label="Shortlisted / hired"
          value={shortlisted}
        />
      </div>
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Your applications</h2>
            <p>Updates from the employers you applied to.</p>
          </div>
          <Link to="/jobs" className="text-link">
            Explore jobs →
          </Link>
        </div>
        {error && <div className="alert error">{error}</div>}
        {loading ? (
          <div className="empty-state">Loading applications…</div>
        ) : applications.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Company</th>
                  <th>Applied</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((a) => (
                  <tr key={a._id}>
                    <td>
                      <Link to={`/jobs/${a.job?._id}`} className="table-title">
                        {a.job?.title || "Job removed"}
                      </Link>
                    </td>
                    <td>{a.job?.company || "—"}</td>
                    <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span
                        className={`status status-${a.status.toLowerCase().replaceAll(" ", "-")}`}
                      >
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <FileText size={30} />
            <h3>Your next opportunity starts here</h3>
            <p>You haven’t applied to any jobs yet.</p>
            <Link to="/jobs" className="btn btn-primary">
              Browse jobs
            </Link>
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
