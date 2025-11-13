import axios from "axios";

const BE_BASE = import.meta.env.VITE_BE_BASE || "http://localhost:8001";

export async function fetchApplications(token) {
  // token: bearer token string
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const url = `${BE_BASE}/api/applications`;
  const resp = await axios.get(url, { headers });
  return resp.data.applications;
}
