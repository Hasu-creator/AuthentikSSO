// FE-portal/src/App.jsx
import { useEffect } from "react";
import Portal from "./pages/Portal";

export default function App() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const tok = url.searchParams.get("token");
    if (tok) {
      // lưu proxy token vào sessionStorage cho domain 5174
      sessionStorage.setItem("sso_token", tok);

      // remove token from URL for security / cleaner UX
      url.searchParams.delete("token");
      window.history.replaceState({}, "", url.pathname + url.search);
      console.log("🔑 Saved proxy token to sessionStorage (5174)");
    }
  }, []);

  return <Portal />;
}
