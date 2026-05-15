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

    if (!normalized.includes("admin")) {
      setLocalErr('Admin login demo requires an email containing "admin".');
      return;
    }

    try {
      await login("admin");
      navigate("/admin", { replace: true });
    } catch (err) {
      setLocalErr("Admin login failed. Try again.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        background: "#f8fafc",
      }}
    >
      {/* LEFT SIDE IMAGE */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?q=80&w=1600&auto=format&fit=crop"
          alt="Admin Login"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.65), rgba(0,0,0,0.25))",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "60px",
            color: "#fff",
          }}
        >
          <p
            style={{
              fontSize: 14,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginBottom: 12,
              color: "#facc15",
            }}
          >
            Marketspivot Admin
          </p>

          <h1
            style={{
              fontSize: "3rem",
              lineHeight: 1.1,
              marginBottom: 16,
              fontWeight: 800,
            }}
          >
            Manage Your Trading Platform
          </h1>

          <p
            style={{
              maxWidth: 500,
              fontSize: 18,
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            Secure admin access for managing users, analytics, market data,
            subscriptions and platform settings.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE LOGIN */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 430,
            background: "#fff",
            padding: 36,
            borderRadius: 24,
            boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ marginBottom: 28 }}>
            <h2
              style={{
                fontSize: 32,
                marginBottom: 10,
                fontWeight: 800,
                color: "#111827",
              }}
            >
              Admin Login
            </h2>

            <p
              style={{
                color: "#6b7280",
                lineHeight: 1.6,
              }}
            >
              Sign in to access the admin dashboard.
            </p>
          </div>

          <form onSubmit={onSubmit}>
            <div style={{ display: "grid", gap: 18 }}>
              <label style={{ display: "grid", gap: 8 }}>
                <span
                  style={{
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  Email Address
                </span>

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@yourdomain.com"
                  style={{
                    padding: "14px 16px",
                    borderRadius: 14,
                    border: "1px solid #d1d5db",
                    fontSize: 15,
                    outline: "none",
                  }}
                />
              </label>

              <label style={{ display: "grid", gap: 8 }}>
                <span
                  style={{
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  Password
                </span>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin"
                  style={{
                    padding: "14px 16px",
                    borderRadius: 14,
                    border: "1px solid #d1d5db",
                    fontSize: 15,
                    outline: "none",
                  }}
                />
              </label>

              {(localErr || error) && (
                <div
                  style={{
                    padding: 14,
                    borderRadius: 14,
                    background: "rgba(239,68,68,0.12)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    color: "#dc2626",
                    fontWeight: 600,
                  }}
                >
                  {localErr ?? error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                style={{
                  height: 54,
                  borderRadius: 14,
                  border: "none",
                  background: "#111827",
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "0.3s",
                }}
              >
                {isLoading ? "Signing in..." : "Login as Admin"}
              </button>

              <div
                style={{
                  textAlign: "center",
                  marginTop: 10,
                  color: "#6b7280",
                }}
              >
                Go to{" "}
                <Link
                  to="/user"
                  style={{
                    color: "#111827",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  User Panel
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}