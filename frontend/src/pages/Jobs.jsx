import React, { useEffect, useState } from "react";

import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import api, { getError } from "../api";
import JobCard from "../components/JobCard";

export default function Jobs() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("All types");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  async function load(query = q, loc = location, jobType = type) {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/jobs", {
        params: { q: query, location: loc, type: jobType },
      });
      setJobs(data.jobs);
    } catch (err) {
      setError(getError(err));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load(params.get("q") || "", "", "All types");
  }, []);
  function submit(e) {
    e.preventDefault();
    setParams(q ? { q } : {});
    load();
  }
  return (
    <main className="page-wrap wrap">
      <div className="page-heading">
        <span className="eyebrow">EXPLORE OPPORTUNITIES</span>
        <h1>Find your next role</h1>
        <p>Search jobs from teams looking for people like you.</p>
      </div>
      <form className="filter-bar" onSubmit={submit}>
        <label className="filter-input">
          <Search />
          <input
            placeholder="Job title, skill, company"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
        <label className="filter-input">
          <MapPin />
          <input
            placeholder="City or location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </label>
        <label className="filter-select">
          <SlidersHorizontal />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option>All types</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Internship</option>
            <option>Remote</option>
          </select>
        </label>
        <button className="btn btn-primary">Search</button>
      </form>
      <div className="results-line">
        <strong>
          {loading
            ? "Searching…"
            : `${jobs.length} ${jobs.length === 1 ? "opportunity" : "opportunities"}`}
        </strong>
        <span>Latest listings first</span>
      </div>
      {error && <div className="alert error">{error}</div>}
      {loading ? (
        <div className="empty-state">Loading jobs…</div>
      ) : jobs.length ? (
        <div className="job-grid">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={32} />
          <h3>No jobs found yet</h3>
          <p>Try another keyword or location, or check back soon.</p>
          <button
            className="btn btn-outline"
            onClick={() => {
              setQ("");
              setLocation("");
              setType("All types");
              load("", "", "All types");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </main>
  );
}
