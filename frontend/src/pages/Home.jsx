import React from "react";
import {
  ArrowRight,
  Search,
  ShieldCheck,
  Users,
  BriefcaseBusiness,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <main>
      <section className="hero">
        <div className="hero-orb orb-one"></div>
        <div className="hero-orb orb-two"></div>
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">
              <Sparkles size={15} /> YOUR NEXT CHAPTER STARTS HERE
            </span>
            <h1>
              Find work that
              <br /> <span>moves you forward.</span>
            </h1>
            <p>
              Discover opportunities from growing teams. Your next great role is
              closer than you think.
            </p>
            <form
              className="hero-search"
              onSubmit={(e) => {
                e.preventDefault();
                navigate(`/jobs?q=${encodeURIComponent(q)}`);
              }}
            >
              <Search size={21} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Job title, skill, or company"
              />
              <button className="btn btn-primary">Search jobs</button>
            </form>
            <div className="hero-trust">
              <span>
                <CheckCircle2 size={15} /> Curated opportunities
              </span>
              <span>
                <CheckCircle2 size={15} /> Simple applications
              </span>
            </div>
          </div>
          <div className="hero-art">
            <div className="art-circle">
              <div className="art-center">
                <BriefcaseBusiness size={44} />
                <strong>Your next role</strong>
                <span>is waiting.</span>
              </div>
            </div>
            <div className="floating-card float-top">
              <span className="float-icon green">
                <CheckCircle2 />
              </span>
              <div>
                <strong>Application sent!</strong>
                <small>Product Designer · Today</small>
              </div>
            </div>
            <div className="floating-card float-bottom">
              <span className="float-icon blue">
                <Users />
              </span>
              <div>
                <strong>Great teams</strong>
                <small>Meet your future coworkers</small>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="stats-strip">
        <div className="wrap stats-grid">
          <div>
            <strong>Discover</strong>
            <span>Roles that fit your skills</span>
          </div>
          <div>
            <strong>Connect</strong>
            <span>With employers directly</span>
          </div>
          <div>
            <strong>Grow</strong>
            <span>Build your next chapter</span>
          </div>
        </div>
      </section>
      <section className="section wrap">
        <div className="section-heading">
          <div>
            <span className="eyebrow">HOW IT WORKS</span>
            <h2>A better way to find your next job</h2>
            <p>Everything you need to move from searching to hired.</p>
          </div>
          <Link to="/jobs" className="text-link">
            Explore jobs <ArrowRight size={17} />
          </Link>
        </div>
        <div className="feature-grid">
          <div className="feature-card">
            <span className="feature-icon">
              <Search />
            </span>
            <h3>Find your fit</h3>
            <p>Search real listings by keyword, location, and job type.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon violet">
              <BriefcaseBusiness />
            </span>
            <h3>Apply with ease</h3>
            <p>Send your application and keep track of every update.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon green">
              <ShieldCheck />
            </span>
            <h3>Stay in control</h3>
            <p>Manage your job search in one simple dashboard.</p>
          </div>
        </div>
      </section>
      <section className="cta-section">
        <div className="wrap cta-inner">
          <div>
            <span className="eyebrow light">YOUR FUTURE, YOUR MOVE</span>
            <h2>Ready for what’s next?</h2>
            <p>Create your free account and start exploring opportunities.</p>
          </div>
          <Link to={user ? "/jobs" : "/register"} className="btn btn-white">
            {user ? "Browse open jobs" : "Create free account"}{" "}
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </main>
  );
}
