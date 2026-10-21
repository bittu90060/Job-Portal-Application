import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("jobportal_user") || "null");
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(
    Boolean(localStorage.getItem("jobportal_token"))
  );

  useEffect(() => {
    const token = localStorage.getItem("jobportal_token");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem("jobportal_user", JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem("jobportal_token");
        localStorage.removeItem("jobportal_user");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);

    localStorage.setItem("jobportal_token", data.token);
    localStorage.setItem("jobportal_user", JSON.stringify(data.user));

    setUser(data.user);
    return data.user;
  };

  const register = async (details) => {
    const { data } = await api.post("/auth/register", details);

    localStorage.setItem("jobportal_token", data.token);
    localStorage.setItem("jobportal_user", JSON.stringify(data.user));

    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("jobportal_token");
    localStorage.removeItem("jobportal_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}