import React, { useState } from "react";
import authService from "../../services/authService";
import { Lock,LogIn } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    await authService.redirectToLogin();
  };

  return (
    <div className="portal-wrapper">
      <div className="portal-card">
        <img
          src="https://logowik.com/content/uploads/images/t_sctv-vietnam3425.logowik.com.webp"
          alt="SCTV Logo"
          className="portal-logo"
        />
        <h1 className="portal-title">SCTV Portal</h1>
        <p className="portal-subtitle">
          Đăng nhập để truy cập hệ thống quản trị và thư viện người dùng.
        </p>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`portal-btn ${loading ? "disabled" : ""}`}
        >
          <Lock className="icon" />
          {loading ? "Đang chuyển hướng..." : "Đăng nhập bằng SSO"}
        </button>

        <p className="portal-footer">© 2025 SCTV Internal System</p>
      </div>
    </div>
    
  );
}
