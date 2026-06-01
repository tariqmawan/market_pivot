import React, { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "../i18n";
import { useAuthStore } from "../stores/authStore";
import { Eye, EyeOff, AlertCircle, CheckCircle2, Shield, X } from "lucide-react";

const API = "http://localhost:3000/api";

type ModalMode = "login" | "signup" | "forgot" | "forgot-sent" | "reset";

type PasswordStrength = "weak" | "fair" | "good" | "strong";

const getPasswordStrength = (password: string): PasswordStrength => {
  if (password.length < 8) return "weak";
  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*]/.test(password)) return "fair";
  if (password.length < 12) return "good";
  return "strong";
};

const strengthLabels: Record<PasswordStrength, string> = {
  weak: "Too short",
  fair: "Add uppercase, number, symbol",
  good: "Good, but could be stronger",
  strong: "Strong password",
};

const strengthColors: Record<PasswordStrength, string> = {
  weak: "#ef4444",
  fair: "#f59e0b",
  good: "#10b981",
  strong: "#059669",
};

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
   const [rememberMe, setRememberMe] = React.useState(false);
   const [showPassword, setShowPassword] = React.useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

   // Validation states
   const [emailError, setEmailError] = React.useState<string | null>(null);
   const [passwordError, setPasswordError] = React.useState<string | null>(null);
   const [nameError, setNameError] = React.useState<string | null>(null);

   // Forgot password state
   const [forgotEmail, setForgotEmail] = React.useState("");
   const [forgotLoading, setForgotLoading] = React.useState(false);
   const [forgotError, setForgotError] = React.useState("");
   const [devResetUrl, setDevResetUrl] = React.useState("");

   // Reset password state
   const [resetToken, setResetToken] = React.useState("");
   const [resetPassword, setResetPassword] = React.useState("");
   const [resetConfirmPassword, setResetConfirmPassword] = React.useState("");
   const [resetLoading, setResetLoading] = React.useState(false);
   const [resetError, setResetError] = React.useState("");
   const [resetDone, setResetDone] = React.useState(false);

   // Focus management for accessibility
   const firstInputRef = React.useRef<HTMLInputElement>(null);
   const modalRef = React.useRef<HTMLDivElement>(null);
   const closeBtnRef = React.useRef<HTMLButtonElement>(null);

   // Focus trap (kept for future focus management)
   const firstFocusableRef = React.useRef<HTMLInputElement>(null);
   const lastFocusableRef = React.useRef<HTMLButtonElement>(null);

   const isOpen = mode === "signup" ? showSignupModal : showLoginModal;

   // Form validation
  const validateEmail = (value: string) => {
    if (!value) return t("emailRequired") ?? "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return t("emailInvalid") ?? "Invalid email format";
    return null;
  };

  const validatePassword = (value: string) => {
    if (!value) return t("passwordRequired") ?? "Password is required";
    if (mode === "signup" && value.length < 8) return t("passwordMinLength") ?? "Password must be at least 8 characters";
    return null;
  };

  const validateName = (value: string) => {
    if (mode === "signup" && !value.trim()) return t("nameRequired") ?? "Full name is required";
    return null;
  };

  // Handle ESC key
  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  }, []);

  useEffect(() => {
    if (showSignupModal) { setMode("signup"); return; }
    if (showLoginModal) { setMode("login"); }
  }, [showLoginModal, showSignupModal]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      firstInputRef.current?.focus();
    }
return () => document.removeEventListener("keydown", handleEscape);
   }, [isOpen, handleEscape]);

   const onClose = () => {
    if (mode === "signup") closeSignupModal();
    else closeLoginModal();
    setMode("login");
    setForgotEmail(""); setForgotError(""); setDevResetUrl("");
    setResetToken(""); setResetPassword(""); setResetConfirmPassword(""); setResetError(""); setResetDone(false);
    setEmail(""); setPassword(""); setName(""); setRememberMe(false);
    setShowPassword(false); setShowConfirmPassword(false);
    setEmailError(null); setPasswordError(null); setNameError(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailVal = email.trim();
    const passVal = password;
    
    const emailErr = validateEmail(emailVal);
    const passErr = validatePassword(passVal);
    
    setEmailError(emailErr);
    setPasswordError(passErr);
    
    if (emailErr || passErr) return;
    
    if (mode === "login") {
      const ok = await login(emailVal, passVal);
      if (ok) {
        if (rememberMe) {
          localStorage.setItem("mp_remember", "true");
        }
        setEmail(""); setPassword("");
      }
    } else {
      const nameErr = validateName(name);
      setNameError(nameErr);
      if (nameErr) return;
      
      const ok = await signup(name.trim(), emailVal, passVal);
      if (ok) {
        setName(""); setEmail(""); setPassword("");
      }
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
      setForgotError(t("serverError") ?? "Could not connect to server. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetPassword !== resetConfirmPassword) { 
      setResetError(t("passwordsMustMatch") ?? "Passwords do not match."); 
      return; 
    }
    if (resetPassword.length < 8) { 
      setResetError(t("passwordMinLength") ?? "Password must be at least 8 characters."); 
      return; 
    }
    setResetLoading(true); setResetError("");
    try {
      const res = await fetch(`${API}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, newPassword: resetPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) { setResetError(data.error ?? t("resetFailed") ?? "Reset failed."); return; }
      setResetDone(true);
    } catch {
      setResetError(t("serverError") ?? "Could not connect to server.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError(validateEmail(e.target.value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError(validatePassword(e.target.value));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (nameError) setNameError(validateName(e.target.value));
  };

  // Password strength indicator
  const passwordStrength = getPasswordStrength(password);
  const showPasswordStrength = mode === "signup" && password.length > 0;

  // Render modal content
  const modalContent = (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div 
        className="modal-container" 
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onClose();
          }
        }}
      >
        <button 
          ref={closeBtnRef}
          className="modal-close" 
          onClick={onClose} 
          aria-label={t("close") ?? "Close"}
        >
          <X size={20} />
        </button>

        {/* ── LOGIN / SIGNUP ── */}
        {(mode === "login" || mode === "signup") && (
          <>
            <div className="modal-header">
              <div className="modal-icon">
                <Shield size={32} style={{ color: "var(--accent-bronze)" }} />
              </div>
              <h2 id="modal-title">{mode === "login" ? t("loginTitle") : t("signUpTitle")}</h2>
              <p>{mode === "login" ? t("loginSubtitle") : t("signUpSubtitle")}</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="modal-form">
              {mode === "signup" && (
                <div className="form-group">
                  <label htmlFor="name">{t("fullName") ?? "Full Name"}</label>
                  <div className="input-wrapper">
                    <input 
                      ref={firstInputRef}
                      type="text" 
                      id="name" 
                      value={name} 
                      onChange={handleNameChange}
                      placeholder={t("namePlaceholder") ?? "Enter your full name"} 
                      required 
                      disabled={isLoading}
                      aria-invalid={!!nameError}
                      aria-describedby={nameError ? "name-error" : undefined}
                    />
                    {nameError && <AlertCircle size={18} className="error-icon" />}
                  </div>
                  {nameError && <span id="name-error" className="error-message">{nameError}</span>}
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="email">{t("emailLabel") ?? "Email address"}</label>
                <div className="input-wrapper">
                  <input 
                    ref={mode === "login" ? firstInputRef : undefined}
                    type="email" 
                    id="email" 
                    value={email} 
                    onChange={handleEmailChange}
                    placeholder={t("emailPlaceholder") ?? "you@example.com"} 
                    required 
                    disabled={isLoading}
                    autoComplete="email"
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "email-error" : undefined}
                  />
                  {emailError && <AlertCircle size={18} className="error-icon" />}
                </div>
                {emailError && <span id="email-error" className="error-message">{emailError}</span>}
              </div>
              
              <div className="form-group">
                <label htmlFor="password">{t("passwordLabel") ?? "Password"}</label>
                <div className="input-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    value={password} 
                    onChange={handlePasswordChange}
                    placeholder={t("passwordPlaceholder") ?? "Your password"} 
                    required 
                    minLength={8} 
                    disabled={isLoading}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? (t("hidePassword") ?? "Hide password") : (t("showPassword") ?? "Show password")}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {passwordError && <span id="password-error" className="error-message">{passwordError}</span>}
                
                {showPasswordStrength && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className={`strength-fill ${passwordStrength}`}
                        style={{ backgroundColor: strengthColors[passwordStrength] }}
                      />
                    </div>
                    <span className="strength-text" style={{ color: strengthColors[passwordStrength] }}>
                      {t(`passwordStrength${passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}`) ?? strengthLabels[passwordStrength]}
                    </span>
                    {passwordStrength !== "strong" && (
                      <ul className="password-requirements">
                        <li className={password.length >= 8 ? "valid" : ""}>
                          <CheckCircle2 size={14} /> {t("passwordRequirementLength") ?? "At least 8 characters"}
                        </li>
                        <li className={/[A-Z]/.test(password) ? "valid" : ""}>
                          <CheckCircle2 size={14} /> {t("passwordRequirementUppercase") ?? "One uppercase letter"}
                        </li>
                        <li className={/[0-9]/.test(password) ? "valid" : ""}>
                          <CheckCircle2 size={14} /> {t("passwordRequirementNumber") ?? "One number"}
                        </li>
                        <li className={/[!@#$%^&*]/.test(password) ? "valid" : ""}>
                          <CheckCircle2 size={14} /> {t("passwordRequirementSymbol") ?? "One special character"}
                        </li>
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {mode === "login" && (
                <div className="form-options">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>{t("rememberMe")}</span>
                  </label>
                  <button type="button" className="link-button" onClick={() => { setForgotEmail(email); setMode("forgot"); }}>
                    {t("forgotPassword")}
                  </button>
                </div>
              )}

              {error && <p className="auth-error" role="alert"><AlertCircle size={16} /> {error}</p>}

              <button type="submit" className="submit-button" disabled={isLoading || !email || !password || (mode === "signup" && !name.trim())}>
                {isLoading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  mode === "login" ? t("signInButton") : t("signUpButton")
                )}
              </button>
            </form>

            <div className="divider"><span>{t("continueWith") ?? "Or continue with"}</span></div>

            <div className="social-buttons">
              <button type="button" className="social-button google" disabled title={t("comingSoon") ?? "Coming soon"}>
                {t("google")}
              </button>
              <button type="button" className="social-button apple" disabled title={t("comingSoon") ?? "Coming soon"}>
                {t("apple")}
              </button>
              <button type="button" className="social-button facebook" disabled title={t("comingSoon") ?? "Coming soon"}>
                {t("facebook")}
              </button>
              <button type="button" className="social-button twitter" disabled title={t("comingSoon") ?? "Coming soon"}>
                {t("twitter")}
              </button>
            </div>

            <div className="modal-footer">
              {mode === "login" ? (
                <p>{t("noAccount") ?? "Don't have an account?"}{" "}
                  <button type="button" className="link-button" onClick={() => openSignupModal()}>
                    {t("createAccount") ?? "Create account"}
                  </button>
                </p>
              ) : (
                <p>{t("alreadyHaveAccount") ?? "Already have an account?"}{" "}
                  <button type="button" className="link-button" onClick={() => openLoginModal()}>
                    {t("login")}
                  </button>
                </p>
              )}
            </div>

            {mode === "signup" && (
              <p className="terms-notice">
                {t("bySigningUp") ?? "By signing up, you agree to our"}{" "}
                <button type="button" className="link-button">{t("privacyPolicy")}</button>{" "}
                {t("andTerms") ?? "and"}{" "}
                <button type="button" className="link-button">{t("terms")}</button>.
              </p>
            )}
          </>
        )}

        {/* ── FORGOT PASSWORD ── */}
        {mode === "forgot" && (
          <>
            <div className="modal-header">
              <div className="modal-icon">
                <Shield size={32} style={{ color: "var(--accent-bronze)" }} />
              </div>
              <h2 id="modal-title">{t("forgotPasswordTitle") ?? "Reset Password"}</h2>
              <p>{t("forgotPasswordSubtitle") ?? "Enter your email and we'll send you a reset link."}</p>
            </div>
            <form onSubmit={handleForgot} className="modal-form">
              <div className="form-group">
                <label htmlFor="forgotEmail">{t("emailLabel") ?? "Email Address"}</label>
                <div className="input-wrapper">
                  <input 
                    ref={firstInputRef}
                    type="email" 
                    id="forgotEmail" 
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder={t("emailPlaceholder") ?? "your@email.com"} 
                    required 
                    disabled={forgotLoading}
                    autoComplete="email"
                  />
                </div>
              </div>
              {forgotError && <p className="auth-error" role="alert"><AlertCircle size={16} /> {forgotError}</p>}
              <button type="submit" className="submit-button" disabled={forgotLoading || !forgotEmail}>
                {forgotLoading ? <span className="loading-spinner"></span> : (t("sendResetLink") ?? "Send Reset Link")}
              </button>
            </form>
            <div className="modal-footer">
              <p><button type="button" className="link-button" onClick={() => setMode("login")}>
                ← {t("backToLogin") ?? "Back to login"}
              </button></p>
            </div>
          </>
        )}

        {/* ── FORGOT SENT ── */}
        {mode === "forgot-sent" && (
          <>
            <div className="modal-header">
              <div className="modal-icon success">
                <CheckCircle2 size={32} style={{ color: "#10b981" }} />
              </div>
              <h2 id="modal-title" style={{ color: "#10b981" }}>{t("resetLinkSent") ?? "Link Sent"}</h2>
              <p>{(t("resetEmailSent") ?? "If {email} is registered, a reset link has been sent.")?.replace("{email}", `<strong>${forgotEmail}</strong>`)}</p>
            </div>

            {devResetUrl && (
              <div className="dev-reset-container">
                <div className="dev-reset-label">{t("devMode") ?? "🛠 Dev mode — reset link:"}</div>
                <button
                  type="button"
                  className="dev-reset-btn"
                  onClick={() => { setMode("reset"); }}
                >
                  {t("clickToReset") ?? "Click to open reset form →"}
                </button>
                <div className="dev-reset-token">
                  {t("token") ?? "Token"}: <code>{resetToken}</code>
                </div>
              </div>
            )}

            <div className="modal-footer">
              <p><button type="button" className="link-button" onClick={() => setMode("login")}>
                ← {t("backToLogin") ?? "Back to login"}
              </button></p>
            </div>
          </>
        )}

        {/* ── RESET PASSWORD ── */}
        {mode === "reset" && (
          <>
            <div className="modal-header">
              <div className="modal-icon">
                <Shield size={32} style={{ color: "var(--accent-bronze)" }} />
              </div>
              <h2 id="modal-title">{resetDone ? (t("passwordChanged") ?? "✓ Password Changed") : (t("setNewPassword") ?? "Set New Password")}</h2>
              <p>{resetDone ? (t("passwordUpdated") ?? "Your password has been updated. You can now log in.") : (t("chooseStrongPassword") ?? "Choose a strong new password.")}</p>
            </div>

            {!resetDone ? (
              <form onSubmit={handleReset} className="modal-form">
                <div className="form-group">
                  <label htmlFor="resetPassword">{t("newPassword") ?? "New Password"}</label>
                  <div className="input-wrapper">
                    <input 
                      ref={firstInputRef}
                      type={showPassword ? "text" : "password"} 
                      id="resetPassword" 
                      value={resetPassword}
                      onChange={(e) => setResetPassword(e.target.value)}
                      placeholder={t("passwordMinLength") ?? "Min 8 characters"} 
                      required 
                      minLength={8} 
                      disabled={resetLoading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? (t("hidePassword") ?? "Hide password") : (t("showPassword") ?? "Show password")}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {resetError && <p className="auth-error" role="alert"><AlertCircle size={16} /> {resetError}</p>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="resetConfirmPassword">{t("confirmPassword") ?? "Confirm Password"}</label>
                  <div className="input-wrapper">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      id="resetConfirmPassword" 
                      value={resetConfirmPassword}
                      onChange={(e) => setResetConfirmPassword(e.target.value)}
                      placeholder={t("confirmPasswordPlaceholder") ?? "Repeat new password"} 
                      required 
                      disabled={resetLoading}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? (t("hidePassword") ?? "Hide password") : (t("showPassword") ?? "Show password")}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {resetPassword && resetConfirmPassword && resetPassword === resetConfirmPassword && (
                    <span className="success-message" style={{ color: "#10b981" }}>
                      <CheckCircle2 size={14} /> {t("passwordsMatch") ?? "Passwords match"}
                    </span>
                  )}
                </div>
                
                <button type="submit" className="submit-button" disabled={resetLoading || !resetPassword || !resetConfirmPassword}>
                  {resetLoading ? <span className="loading-spinner"></span> : (t("setNewPassword") ?? "Set New Password")}
                </button>
              </form>
            ) : (
              <div className="success-actions">
                <button type="button" className="submit-button" onClick={() => { setMode("login"); setResetDone(false); }}>
                  {t("goToLogin") ?? "Go to Login"}
                </button>
              </div>
            )}

            {!resetDone && (
              <div className="modal-footer">
                <p><button type="button" className="link-button" onClick={() => setMode("forgot-sent")}>
                  ← {t("back") ?? "Back"}
                </button></p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  if (!isOpen) return null;

  return createPortal(modalContent, document.body);
};

export default LoginModal;