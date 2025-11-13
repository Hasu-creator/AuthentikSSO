// PortalPage.jsx
import React, { useEffect, useState } from "react";
import { fetchApplications } from "./api";

function getTokenFromUrlOrStorage() {
  const params = new URLSearchParams(window.location.search);

  // ưu tiên access_token (mới)
  const access = params.get("access_token") || params.get("token");
  if (access) {
    localStorage.setItem("access_token", access);
    return access;
  }

  // fallback: check localStorage
  return localStorage.getItem("access_token") || localStorage.getItem("token");
}

export default function PortalPage() {
  const [apps, setApps] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const token = getTokenFromUrlOrStorage();
    if (!token) {
      setErr("Missing token. Please login first.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetchApplications(token);
        setApps(res);
      } catch (e) {
        console.error("fetch apps error", e);
        // axios error structure
        const msg = e?.response?.data?.detail || e?.response?.data || e.message || "Failed to fetch";
        setErr(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="center">Loading apps...</div>;
  if (err) return <div className="alert error">User info failed: {err}</div>;
  if (!apps || apps.length === 0) return <div className="center">No applications available.</div>;

  return (
    <div className="portal-list">
      {apps.map((a) => (
        <div key={a.slug || a.launch_url} className="app-card">
          <div className="app-left">
            {a.icon ? <img src={a.icon} alt={a.name} className="app-icon" /> : <div className="app-icon placeholder" />}
          </div>
          <div className="app-main">
            <h3>{a.name}</h3>
            <p className="desc">{a.description}</p>
            <div className="meta">Provider: {a.provider || "-"}</div>
          </div>
          <div className="app-actions">
            {a.launch_url ? (
              <a href={a.launch_url} target="_blank" rel="noreferrer">
                <button>Open</button>
              </a>
            ) : (
              <button disabled>No URL</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
