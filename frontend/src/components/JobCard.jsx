import React from "react";
import { MapPin, Clock3, ArrowUpRight, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function JobCard({ job }) {
  return (
    <article className="job-card">
      <div className="job-card-top">
        <div className="company-mark">
          <Building2 size={22} />
        </div>
        <span className="pill">{job.type}</span>
      </div>
      <h3>
        <Link to={`/jobs/${job._id}`}>{job.title}</Link>
      </h3>
      <p className="company-name">{job.company}</p>
      <p className="job-description">{job.description}</p>
      <div className="job-meta">
        <span>
          <MapPin size={15} />
          {job.location}
        </span>
        <span>
          <Clock3 size={15} />
          {new Date(job.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="job-card-bottom">
        <div>
          <span className="salary">{job.salary || "Not disclosed"}</span>
          <span className="salary-label"> / salary</span>
        </div>
        <Link
          className="arrow-link"
          to={`/jobs/${job._id}`}
          aria-label={`View ${job.title}`}
        >
          <ArrowUpRight size={19} />
        </Link>
      </div>
    </article>
  );
}
