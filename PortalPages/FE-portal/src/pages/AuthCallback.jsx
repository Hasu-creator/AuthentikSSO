import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    async function handleCallback() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const state = params.get("state");

      if (!code) {
        console.error("No code found in callback URL");
        return;
      }

      // Gửi tới backend để đổi code -> access_token
      const res = await fetch("http://localhost:8000/auth/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, state }),
      });

      const data = await res.json();
      console.log("Backend callback response:", data);

      if (data.access_token) {
        sessionStorage.setItem("sso_token", data.access_token);
        console.log("🔑 Saved token:", data.access_token);

        navigate("/"); // quay lại portal homepage
      } else {
        console.error("❌ Lỗi callback: Không nhận được access_token");
      }
    }

    handleCallback();
  }, []);

  return <div className="text-center p-10">Đang xử lý đăng nhập...</div>;
}
