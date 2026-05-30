import React from "react";
import { useI18n } from "../i18n";
import { useAuthStore } from "../stores/authStore";

const API = "http://localhost:3000/api";

type ModalMode = "login" | "signup" | "forgot" | "forgot-sent" | "reset";

const LoginModal: React.FC<{ mode?: "login" | "signup" }> = ({ mode: initialMode = "login" }) => {
  const { t: _t } = useI18n();
  const t = _t as (key: string) => string | undefined;
  const {
    showLoginModal, showSignupModal,
    closeLoginModal, closeSignupModal,
    openLoginModal, openSignupModal,
    login, signup, isLoading, error,
  } = useAuthStore();

  const [mode, setMode] = React.useState<ModalMode>(initialMode);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");

  // Forgot password state
  const [forgotEmail, setForgotEmail] = React.useState("");
  const [forgotLoading, setForgotLoading] = React.useState(false);
  const [forgotError, setForgotError] = React.useState("");
  const [devResetUrl, setDevResetUrl] = React.useState("");

  // Reset password state
  const [resetToken, setResetToken] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [resetLoading, setResetLoading] = React.useState(false);
  const [resetError, setResetError] = React.useState("");
  const [resetDone, setResetDone] = React.useState(false);

  React.useEffect(() => {
    if (showSignupModal) { setMode("signup"); return; }
    if (showLoginModal) { setMode("login"); }
  }, [showLoginModal, showSignupModal]);

  const isOpen = mode === "signup" ? showSignupModal : showLoginModal;
  const onClose = () => {
    if (mode === "signup") closeSignupModal();
    else closeLoginModal();
    setMode("login");
    setForgotEmail(""); setForgotError(""); setDevResetUrl("");
    setResetToken(""); setNewPassword(""); setConfirmPassword(""); setResetError(""); setResetDone(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (mode === "login") {
      const ok = await login(email, password);
      if (ok) { setEmail(""); setPassword(""); }
    } else {
      if (!name.trim()) return;
      const ok = await signup(name.trim(), email, password);
      if (ok) { setName(""); setEmail(""); setPassword(""); }
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotLoading(true); setForgotError("");
    try {
      const res = await fetch(`${API}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (data.data?.resetUrl) setDevResetUrl(data.data.resetUrl);
      if (data.data?.resetToken) setResetToken(data.data.resetToken);
      setMode("forgot-sent");
    } catch {
      setForgotError("Could not connect to server. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setResetError("Passwords do not match."); return; }
    if (newPassword.length < 8) { setResetError("Password must be at least 8 characters."); return; }
    setResetLoading(true); setResetError("");
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) { setResetError(data.error ?? "Reset failed."); return; }
      setResetDone(true);
    } catch {
      setResetError("Could not connect to server.");
    } finally {
      setResetLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>

        {/* ── LOGIN / SIGNUP ── */}
        {(mode === "login" || mode === "signup") && (
          <>
            <div className="modal-header">
              <h2>{mode === "login" ? t("loginTitle") : t("signUpTitle")}</h2>
              <p>{mode === "login" ? t("loginSubtitle") : t("signUpSubtitle")}</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="modal-form">
              {mode === "signup" && (
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name" required disabled={isLoading} />
                </div>
              )}
              <div className="form-group">
                <label htmlFor="email">{t("emailLogin")}</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")} required disabled={isLoading} />
              </div>
              <div className="form-group">
                <label htmlFor="password">{t("passwordPlaceholder")}</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("passwordPlaceholder")} required minLength={8} disabled={isLoading} />
              </div>

              {mode === "login" && (
                <div className="form-options">
                  <label className="checkbox-label">
                    <input type="checkbox" /><span>{t("rememberMe")}</span>
                  </label>
                  <button type="button" className="link-button" onClick={() => { setForgotEmail(email); setMode("forgot"); }}>
                    {t("forgotPassword")}
                  </button>
                </div>
              )}

              {error && <p style={{ color: "#ef4444", fontSize: 14, margin: 0 }}>{error}</p>}

              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? t("loggingIn") : mode === "login" ? t("signInButton") : t("signUpButton")}
              </button>
            </form>

            <div className="divider"><span>{t("continueWith")}</span></div>

            <div className="social-buttons">
              <button type="button" className="social-button google" disabled title={t("comingSoon") || "Coming soon"}>{t("google")}</button>
              <button type="button" className="social-button apple" disabled title={t("comingSoon") || "Coming soon"}>{t("apple")}</button>
              <button type="button" className="social-button facebook" disabled title={t("comingSoon") || "Coming soon"}>{t("facebook")}</button>
              <button type="button" className="social-button twitter" disabled title={t("comingSoon") || "Coming soon"}>{t("twitter")}</button>
              <button
                type="button" className="social-button admin"
                onClick={async () => {
                  const ok = await login("admin@marketspivot.com", "Admin@123456");
                  if (ok) { onClose(); window.location.href = "/admin"; }
                }}
                style={{ background: "#333", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, border: "none", cursor: "pointer" }}
              >
                {t("adminPortal")}
              </button>
            </div>

            <div className="modal-footer">
              {mode === "login" ? (
                <p>{t("noAccount")}{" "}<button type="button" className="link-button" onClick={() => openSignupModal()}>{t("createAccount")}</button></p>
              ) : (
                <p>{t("alreadyHaveAccount")}{" "}<button type="button" className="link-button" onClick={() => openLoginModal()}>{t("login")}</button></p>
              )}
            </div>

            {mode === "signup" && (
              <p className="terms-notice">
                {t("bySigningUp")}{" "}
                <button type="button" className="link-button">{t("privacyPolicy")}</button>{" "}
                {t("andTerms")}{" "}
                <button type="button" className="link-button">{t("terms")}</button>.
              </p>
            )}
          </>
        )}

        {/* ── FORGOT PASSWORD ── */}
        {mode === "forgot" && (
          <>
            <div className="modal-header">
              <h2>Reset Password</h2>
              <p>Enter your email and we'll send you a reset link.</p>
            </div>
            <form onSubmit={handleForgot} className="modal-form">
              <div className="form-group">
                <label htmlFor="forgotEmail">Email Address</label>
                <input type="email" id="forgotEmail" value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="your@email.com" required disabled={forgotLoading} />
              </div>
              {forgotError && <p style={{ color: "#ef4444", fontSize: 14, margin: 0 }}>{forgotError}</p>}
              <button type="submit" className="submit-button" disabled={forgotLoading}>
                {forgotLoading ? "Sending…" : "Send Reset Link"}
              </button>
            </form>
            <div className="modal-footer">
              <p><button type="button" className="link-button" onClick={() => setMode("login")}>← Back to login</button></p>
            </div>
          </>
        )}

        {/* ── FORGOT SENT ── */}
        {mode === "forgot-sent" && (
          <>
            <div className="modal-header">
              <h2 style={{ color: "#16a34a" }}>✓ Link Sent</h2>
              <p>If <strong>{forgotEmail}</strong> is registered, a reset link has been sent.</p>
            </div>

            {devResetUrl && (
              <div style={{
                margin: "12px 0", padding: "14px 16px",
                background: "rgba(234,179,8,0.08)", border: "1px solid rgba(234,179,8,0.3)",
                fontSize: 13,
              }}>
                <div style={{ fontWeight: 800, color: "#92400e", marginBottom: 8 }}>🛠 Dev mode — reset link:</div>
                <button
                  type="button"
                  style={{ background: "#C9A87B", color: "#0f172a", border: "none", padding: "8px 14px", fontWeight: 800, cursor: "pointer", width: "100%", textAlign: "left", wordBreak: "break-all", fontSize: 12 }}
                  onClick={() => { setMode("reset"); }}
                >
                  Click to open reset form →
                </button>
                <div style={{ marginTop: 8, color: "#6b7280", fontSize: 11 }}>Token: <code style={{ background: "#f3f4f6", padding: "2px 4px" }}>{resetToken}</code></div>
              </div>
            )}

            <div className="modal-footer">
              <p><button type="button" className="link-button" onClick={() => setMode("login")}>← Back to login</button></p>
            </div>
          </>
        )}

        {/* ── RESET PASSWORD ── */}
        {mode === "reset" && (
          <>
            <div className="modal-header">
              <h2>{resetDone ? "✓ Password Changed" : "Set New Password"}</h2>
              <p>{resetDone ? "Your password has been updated. You can now log in." : "Choose a strong new password."}</p>
            </div>

            {!resetDone ? (
              <form onSubmit={handleReset} className="modal-form">
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input type="password" id="newPassword" value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters" required minLength={8} disabled={resetLoading} />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input type="password" id="confirmPassword" value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password" required disabled={resetLoading} />
                </div>
                {resetError && <p style={{ color: "#ef4444", fontSize: 14, margin: 0 }}>{resetError}</p>}
                <button type="submit" className="submit-button" disabled={resetLoading}>
                  {resetLoading ? "Saving…" : "Set New Password"}
                </button>
              </form>
            ) : (
              <div style={{ padding: "0 0 16px" }}>
                <button type="button" className="submit-button" onClick={() => { setMode("login"); setResetDone(false); }}>
                  Go to Login
                </button>
              </div>
            )}

            {!resetDone && (
              <div className="modal-footer">
                <p><button type="button" className="link-button" onClick={() => setMode("forgot-sent")}>← Back</button></p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
