import React from "react";
import { useAuthStore } from "../stores/authStore";
import { useNavigate, Link } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isLoading, error, setError } = useAuthStore();

  const [email, setEmail] = React.useState("admin@marketspivot.com");
  const [password, setPassword] = React.useState("admin");
  const [localErr, setLocalErr] = React.useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalErr(null);
    setError(null);

    const normalized = (email || "").trim().toLowerCase();
    if (!normalized) {
      setLocalErr("Email required");
      return;
    }
    if (!password) {
      setLocalErr("Password required");
      return;
    }

    // Demo validation:
    // (a) If email contains "admin" => admin login.
    // Password is only UI-level (mock app) for now.
    if (!normalized.includes("admin")) {
      setLocalErr('Admin login demo requires an email containing "admin".');
      return;
    }

    try {
      // authStore mock: provider === "admin" => isAdmin: true
      await login("admin");

      // After login, go to admin dashboard
      navigate("/admin", { replace: true });
    } catch (err) {
      setLocalErr("Admin login failed. Try again.");
    }
  };

  return (
    <div className="page">
      <div className="section-heading">
        <p className="eyebrow">Admin</p>
        <h1>Admin Login</h1>
        <p>Demo login: use an email containing “admin” to access the admin panel.</p>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <form
          onSubmit={onSubmit}
          style={{
            background: "rgba(255,255,255,0.75)",
            border: "1px solid rgba(200,155,94,0.2)",
            borderRadius: 16,
            padding: 20,
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ display: "grid", gap: 12 }}>
            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontWeight: 700 }}>Email</span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yourdomain.com"
                style={{ padding: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,0.1)" }}
              />
            </label>

            <label style={{ display: "grid", gap: 6 }}>
              <span style={{ fontWeight: 700 }}>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin"
                style={{ padding: 12, borderRadius: 12, border: "1px solid rgba(0,0,0,0.1)" }}
              />
            </label>

            {(localErr || error) && (
              <div
                style={{
                  padding: 12,
                  borderRadius: 12,
                  background: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.25)",
                  color: "#b91c1c",
                  fontWeight: 700,
                }}
              >
                {localErr ?? error}
              </div>
            )}

            <button type="submit" className="primary-action" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Login as Admin"}
            </button>

            <div style={{ marginTop: 6, textAlign: "center", color: "rgba(0,0,0,0.65)" }}>
              <Link to="/user" style={{ textDecoration: "underline" }}>
                User Panel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
