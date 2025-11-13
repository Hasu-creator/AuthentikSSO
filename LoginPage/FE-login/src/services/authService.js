    export const AUTH_CONFIG = {
    ISSUER: "https://ssotest.sctvdev.top",
    AUTHORIZATION_ENDPOINT: "https://ssotest.sctvdev.top/application/o/authorize/",
    TOKEN_ENDPOINT: "https://ssotest.sctvdev.top/application/o/token/",
    USERINFO_ENDPOINT: "https://ssotest.sctvdev.top/application/o/userinfo/",
    END_SESSION_ENDPOINT: "https://ssotest.sctvdev.top/application/o/login-service/end-session/",
    CLIENT_ID: "H0EepVMpP8qazmCgV99PlCwuZX3HDfa0kqwd3h1C",
    REDIRECT_URI: "http://localhost:3012/auth/callback",
    BACKEND_URL: "http://localhost:8000" // BE login FastAPI
    };

    // Hàm random cho state
    function rand(len = 43) {
    const a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~";
    return Array.from(crypto.getRandomValues(new Uint8Array(len)))
        .map((x) => a[x % a.length])
        .join("");
    }

    const authService = {
    // 🔹 Bước 1: Redirect đến Authentik để đăng nhập
    redirectToLogin: async () => {
        const state = rand(16);

        // Lưu state vào localStorage để so sánh sau callback
        localStorage.setItem("oauth_state", state);

        const params = new URLSearchParams({
        client_id: AUTH_CONFIG.CLIENT_ID,
        response_type: "code",
        scope: "openid profile email",
        redirect_uri: AUTH_CONFIG.REDIRECT_URI,
        state,
        });

        const fullUrl = AUTH_CONFIG.AUTHORIZATION_ENDPOINT + "?" + params.toString();
        console.log("🟩 Redirecting to:", fullUrl);
        window.location.href = fullUrl;
    },

    // 🔹 Bước 2: Xử lý callback từ Authentik
    handleCallback: async (searchParams) => {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const savedState = localStorage.getItem("oauth_state");

        console.log("📦 Received state:", state);
        console.log("💾 Saved state:", savedState);

        if (!code) throw new Error("No authorization code received");
        if (!state || state !== savedState)
        throw new Error("Invalid state — state mismatch");

        // Xoá state sau khi sử dụng
        localStorage.removeItem("oauth_state");

        // Gửi code sang BE để đổi token
        const res = await fetch(`${AUTH_CONFIG.BACKEND_URL}/api/auth/callback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        });

        if (!res.ok) throw new Error("Callback failed");
        const data = await res.json();
        console.log("🟩 Callback response from backend:", data);
        return data;
    },

    // 🔹 Bước 3: Logout
    logout: () => {
        const logoutUrl = `${AUTH_CONFIG.END_SESSION_ENDPOINT}?post_logout_redirect_uri=${encodeURIComponent(
        "http://localhost:3012/login"
        )}`;
        localStorage.clear();
        window.location.href = logoutUrl;
    },
    };
    console.log("🧩 Full localStorage content:", { ...localStorage });
    console.log("🧩 Full sessionStorage content:", { ...sessionStorage });
    export default authService;
