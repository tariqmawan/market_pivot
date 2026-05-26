import React from "react";

import { Link } from "react-router-dom";

import { useI18n } from "../i18n";

import { useAuthStore } from "../stores/authStore";



interface LoginModalProps {

  mode?: "login" | "signup";

}



const LoginModal: React.FC<LoginModalProps> = ({ mode: initialMode = "login" }) => {

  const { t } = useI18n();

  const {

    showLoginModal,

    showSignupModal,

    closeLoginModal,

    closeSignupModal,

    openLoginModal,

    openSignupModal,

    login,

    signup,

    isLoading,

    error,

  } = useAuthStore();

  const [mode, setMode] = React.useState<"login" | "signup">(initialMode);

  const [email, setEmail] = React.useState("");

  const [password, setPassword] = React.useState("");

  const [name, setName] = React.useState("");



  React.useEffect(() => {

    if (showSignupModal) {

      setMode("signup");

      return;

    }



    if (showLoginModal) {

      setMode("login");

    }

  }, [showLoginModal, showSignupModal]);



  const isOpen = mode === "login" ? showLoginModal : showSignupModal;

  const onClose = mode === "login" ? closeLoginModal : closeSignupModal;



  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (!email || !password) return;



    if (mode === "login") {

      const ok = await login(email, password);

      if (ok) {

        setEmail("");

        setPassword("");

      }

    } else {

      if (!name.trim()) return;

      const ok = await signup(name.trim(), email, password);

      if (ok) {

        setName("");

        setEmail("");

        setPassword("");

      }

    }

  };



  const switchMode = () => {

    if (mode === "login") {

      openSignupModal();

    } else {

      openLoginModal();

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

          {mode === "signup" && (

            <div className="form-group">

              <label htmlFor="name">Name</label>

              <input

                type="text"

                id="name"

                value={name}

                onChange={(e) => setName(e.target.value)}

                placeholder="Enter your name"

                required

                disabled={isLoading}

              />

            </div>

          )}

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

              minLength={8}

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



          {error && (

            <p style={{ color: "#ef4444", fontSize: 14, margin: 0 }}>{error}</p>

          )}



          <button type="submit" className="submit-button" disabled={isLoading}>

            {isLoading ? t("loggingIn") : mode === "login" ? t("signInButton") : t("signUpButton")}

          </button>

        </form>



        <div className="divider">

          <span>{t("continueWith")}</span>

        </div>



        <div className="social-buttons">

          <button type="button" className="social-button google" disabled title="Coming soon">

            {t("google")}

          </button>

          <button type="button" className="social-button apple" disabled title="Coming soon">

            {t("apple")}

          </button>

          <button type="button" className="social-button facebook" disabled title="Coming soon">

            {t("facebook")}

          </button>

          <button type="button" className="social-button twitter" disabled title="Coming soon">

            {t("twitter")}

          </button>



          <button
            type="button"
            className="social-button admin"
            onClick={async () => {
              const ok = await login("admin@marketspivot.com", "Admin@123456");
              if (ok) {
                onClose();
                window.location.href = "/admin";
              }
            }}
            style={{
              background: "#333",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Admin Portal
          </button>

        </div>



        <div className="modal-footer">

          {mode === "login" ? (

            <p>

              {t("noAccount")}{" "}

              <button type="button" className="link-button" onClick={switchMode}>

                {t("createAccount")}

              </button>

            </p>

          ) : (

            <p>

              {t("alreadyHaveAccount")}{" "}

              <button type="button" className="link-button" onClick={switchMode}>

                {t("login")}

              </button>

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

