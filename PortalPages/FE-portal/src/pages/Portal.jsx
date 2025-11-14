// FE-portal/src/pages/Portal.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import AppCard from "../components/AppCard";

export default function Portal() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchApps() {
      try {
        const token = sessionStorage.getItem("sso_token");
        console.log("🔑 Token used to call BE:", token);

        if (!token) {
          setError("Không tìm thấy token đăng nhập.");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:8001/api/applications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("❌ BE trả lỗi:", text);
          throw new Error("Không lấy được danh sách ứng dụng.");
        }

        const data = await res.json();
        console.log("📦 Library:", data);
        setApps(data.applications || []);
      } catch (err) {
        console.error("🔥 Lỗi load ứng dụng:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchApps();
  }, []);

  return (
    <>
      <Navbar />
      <main className="p-8 max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold mb-6 text-gray-700 tracking-tight">Applications</h2>

        {loading && <p className="text-gray-500">Đang tải ứng dụng…</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && apps.length === 0 && <p className="text-gray-600">Không có ứng dụng nào.</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {apps.map((app) => (
            <AppCard key={app.slug || app.pk} name={app.name} description={app.description || app.meta_description} url={app.launch_url} icon="📦" />
          ))}
        </div>
      </main>
    </>
  );
}
