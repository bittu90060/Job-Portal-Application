import React, { useState } from "react";
import {
  BriefcaseBusiness,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dashboard =
    user?.role === "admin"
      ? "/admin"
      : user?.role === "employer"
        ? "/employer"
        : "/seeker";
  const signOut = () => {
    logout();
    setOpen(false);
    navigate("/");
  };
  return (
    <header className="navbar">
      <div className="nav-inner wrap">
        <Link to="/" className="brand">
          <span className="brand-icon">
            <BriefcaseBusiness size={21} />
          </span>
          JobBridge<span className="brand-dot">.</span>
        </Link>
        <button
          className="mobile-menu"
          onClick={() => setOpen(!open)}
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? "nav-links open" : "nav-links"}>
          <NavLink to="/jobs" onClick={() => setOpen(false)}>
            Find Jobs
          </NavLink>
          {user && (
            <NavLink to={dashboard} onClick={() => setOpen(false)}>
              <LayoutDashboard size={16} /> Dashboard
            </NavLink>
          )}
          {!user ? (
            <>
              <Link
                className="nav-login"
                to="/login"
                onClick={() => setOpen(false)}
              >
                Log in
              </Link>
              <Link
                className="btn btn-primary btn-small"
                to="/register"
                onClick={() => setOpen(false)}
              >
                Get started
              </Link>
            </>
          ) : (
            <button className="nav-user" onClick={signOut}>
              <span className="avatar">{user.name?.[0]?.toUpperCase()}</span>
              <span>{user.name?.split(" ")[0]}</span>
              <LogOut size={15} />
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
