import React from "react";
import { useI18n } from "../i18n";
import { useAuthStore } from "../stores/authStore";

interface LoginModalProps {
  mode?: "login" | "signup";
}

const LoginModal: React.FC<LoginModalProps> = ({ mode: initialMode = "login" }) => {
  const { t } = useI18n();
  const { showLoginModal, showSignupModal, closeLoginModal, closeSignupModal, login, signup, isLoading } = useAuthStore();
  const [mode, setMode] = React.useState<"login" | "signup">(initialMode);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const isOpen = mode === "login" ? showLoginModal : showSignupModal;
  const onClose = mode === "login" ? closeLoginModal : closeSignupModal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (mode === "login") {
      await login("email");
    } else {
      await signup("email");
    }
  };

  const handleSocialLogin = async (provider: string) => {
    if (mode === "login") {
      await login(provider);
    } else {
      await signup(provider);
    }
  };

  const switchMode = () => {
    if (mode === "login") {
      setMode("signup");
    } else {
      setMode("login");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label={t("loginClose")}>
          ×
        </button>

        <div className="modal-header">
          <h2>{mode === "login" ? t("loginTitle") : t("signUpTitle")}</h2>
          <p>{mode === "login" ? t("loginSubtitle") : t("signUpSubtitle")}</p>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="email">{t("emailLogin")}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              required
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">{t("passwordPlaceholder")}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordPlaceholder")}
              required
              disabled={isLoading}
            />
          </div>

          {mode === "login" && (
            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>{t("rememberMe")}</span>
              </label>
              <button type="button" className="link-button">
                {t("forgotPassword")}
              </button>
            </div>
          )}

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? t("loggingIn") : mode === "login" ? t("signInButton") : t("signUpButton")}
          </button>
        </form>

        <div className="divider">
          <span>{t("continueWith")}</span>
        </div>

        <div className="social-buttons">
          <button
            type="button"
            className="social-button google"
            onClick={() => handleSocialLogin("google")}
            disabled={isLoading}
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {t("google")}
          </button>

          <button
            type="button"
            className="social-button apple"
            onClick={() => handleSocialLogin("apple")}
            disabled={isLoading}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            {t("apple")}
          </button>

          <button
            type="button"
            className="social-button facebook"
            onClick={() => handleSocialLogin("facebook")}
            disabled={isLoading}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            {t("facebook")}
          </button>

          <button
            type="button"
            className="social-button twitter"
            onClick={() => handleSocialLogin("twitter")}
            disabled={isLoading}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="#1DA1F2">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
            {t("twitter")}
          </button>
        </div>

        <div className="modal-footer">
          {mode === "login" ? (
            <p>
              {t("noAccount")} <button type="button" className="link-button" onClick={switchMode}>{t("createAccount")}</button>
            </p>
          ) : (
            <p>
              {t("alreadyHaveAccount")} <button type="button" className="link-button" onClick={switchMode}>{t("login")}</button>
            </p>
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
      </div>
    </div>
  );
};

export default LoginModal;
