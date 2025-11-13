import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [msg, setMsg] = useState("Đang xử lý đăng nhập...");
  const [fadeOut, setFadeOut] = useState(false);
  const [hasRun, setHasRun] = useState(false); // tránh chạy hai lần

  useEffect(() => {
    if (hasRun) return;
    setHasRun(true);

    (async () => {
      console.log("🟦 [AuthCallback] Bắt đầu xử lý callback...");
      try {
        const params = new URLSearchParams(window.location.search);
        const data = await authService.handleCallback(params);
        
        console.log("✅ Auth callback success:", data);
        console.log("👤 User:", data.user);
        console.log("🔑 Is superuser:", data.user?.is_superuser);
        
        
        // Lưu user/token vào context
        login(data.access_token, data.user);

        // Kiểm tra phân quyền
        const isAdmin =
          data.user?.is_superuser === true ||
          data.user?.groups?.includes("authentik Admins") ||
          data.user?.groups?.includes("admin");

        console.log("👑 Phân quyền:", isAdmin ? "Admin" : "User");

        // Fade-out trước khi redirect
        setMsg(isAdmin ? "Chuyển đến trang Admin..." : "Chuyển đến Portal...");
        setFadeOut(true);

        setTimeout(() => {
          if (isAdmin) {
            // ✅ FIXED: Admin redirect với session
            console.log("➡️ Redirecting to Admin App (5173)");
            window.location.href = `http://localhost:5173?token=${data.access_token}`;
          } else {
            // ✅ FIXED: User redirect với session
            console.log("➡️ Redirecting to Portal App (5174)");
            // USER (role nhân viên)
            window.location.href = `http://localhost:5174?token=${data.access_token}`;

          }
        }, 500);
        
      } catch (err) {
        console.error("❌ Lỗi trong callback:", err);
        setMsg(err.message || "Đăng nhập thất bại, vui lòng thử lại.");
        
        // Hiển thị nút quay lại sau 2s
        setTimeout(() => {
          setMsg("Đăng nhập thất bại! Nhấn F5 để thử lại.");
        }, 2000);
      }
    })();
  }, [hasRun, login]);

  return (
    <div
      className={`callback-container ${fadeOut ? "fade-out" : ""}`}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #cddfff 0%, #b2c6ff 100%)",
        backgroundAttachment: "fixed",
        filter: "blur(0.2px)",
        color: "#1e3a8a",
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: "1rem",
        transition: "opacity 0.4s ease",
      }}
    >
      <div className="spinner"></div>
      <p style={{ marginTop: "1rem", fontSize: "1.1rem", fontWeight: 500 }}>
        {msg}
      </p>

      {/* Inline CSS cho animation */}
      <style>{`
        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(30, 58, 138, 0.2);
          border-top-color: #1e3a8a;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .fade-out {
          opacity: 0;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}