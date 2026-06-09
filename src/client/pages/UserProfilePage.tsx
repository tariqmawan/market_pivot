import React from "react";
import { useAuthStore } from "../stores/authStore";
import { useUserPreferencesStore, type Theme, type RiskProfile, type NotificationChannel } from "../stores/preferencesStore";
import { useActivityStore } from "../stores/activityStore";
import { useWatchlistStore } from "../stores/watchlistStore";
import { usePortfolioStore } from "../stores/portfolioStore";
import LanguageSwitcher from "../components/LanguageSwitcher";
import "./UserProfilePage.css";
import { useI18n } from "../i18n";



const ACTIVITY_ICONS: Record<string, string> = {
  login: "🔓",
  logout: "🔒",
  watchlist_add: "⭐",
  watchlist_remove: "☆",
  watchlist_create: "📋",
  watchlist_delete: "🗑",
  portfolio_add: "💼",
  portfolio_edit: "✏️",
  portfolio_delete: "🗑",
  alert_create: "🔔",
  alert_trigger: "⚠️",
  screener_run: "🔍",
  screen_save: "💾",
  profile_update: "👤",
  settings_change: "⚙️",
  view: "👁",
};

const formatTimestamp = (ts: number) => {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  const hour = Math.floor(diff / 3600000);
  const day = Math.floor(diff / 86400000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  if (hour < 24) return `${hour}h ago`;
  if (day < 7) return `${day}d ago`;
  return new Date(ts).toLocaleDateString();
};

const UserProfilePage: React.FC = () => {
  const { t } = useI18n();
  const { language } = useI18n();
  const { user, isAuthenticated, updateUser, logout } = useAuthStore();
  const prefs = useUserPreferencesStore();
  const { activities, clear: clearActivity, log } = useActivityStore();
  const { watchlists } = useWatchlistStore();
  const { portfolios } = usePortfolioStore();

  const [activeSection, setActiveSection] = React.useState<"profile" | "preferences" | "notifications" | "privacy" | "security" | "activity" | "sessions">("profile");
  const [name, setName] = React.useState(user?.name ?? "");
  const [email, setEmail] = React.useState(user?.email ?? "");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordMsg, setPasswordMsg] = React.useState<{ type: "success" | "error"; text: string } | null>(null);
  const [actionMsg, setActionMsg] = React.useState<string | null>(null);
  const [revokedSessions, setRevokedSessions] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
  }, [user]);

  if (!isAuthenticated || !user) {
    return (
      <div className="page user-profile-page">
        <section className="user-auth-card">
          <h1>{t("userProfile.signInTitle")}</h1>
          <p>{t("userProfile.signInSubtitle")}</p>
        </section>
      </div>
    );
  }

  const handleSaveProfile = () => {
    updateUser({ name, email });
    log("profile_update", "Profile information updated");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setPasswordMsg({ type: "error", text: "Password must be at least 8 characters" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "Passwords do not match" });
      return;
    }
    setPasswordMsg({ type: "success", text: "Password updated successfully" });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    log("settings_change", "Password changed");
  };

  const handleToggle2FA = () => {
    prefs.updateSecurity("twoFactorEnabled", !prefs.security.twoFactorEnabled);
    log("settings_change", `2FA ${!prefs.security.twoFactorEnabled ? "enabled" : "disabled"}`);
  };

  const showActionMsg = (msg: string) => {
    setActionMsg(msg);
    window.setTimeout(() => setActionMsg(null), 2800);
  };

  const handleDownloadData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      user,
      preferences: {
        theme: prefs.theme,
        baseCurrency: prefs.baseCurrency,
        defaultMarket: prefs.defaultMarket,
        riskProfile: prefs.riskProfile,
        layoutDensity: prefs.layoutDensity,
        defaultLanding: prefs.defaultLanding,
        notifications: prefs.notifications,
        privacy: prefs.privacy,
        security: prefs.security,
      },
      watchlists,
      portfolios,
      activities,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marketspivot-${user?.name?.replace(/\s+/g, "-").toLowerCase() ?? "user"}-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    log("settings_change", "Exported account data");
    showActionMsg("✅ Account data downloaded");
  };

  const handleDeleteAccount = () => {
    if (!window.confirm("Permanently delete your account? This clears all local data (watchlists, portfolios, activity, preferences) and signs you out. This cannot be undone.")) return;
    if (!window.confirm("Are you absolutely sure? Type confirmation by clicking OK once more.")) return;
    prefs.resetAll();
    clearActivity();
    try {
      localStorage.removeItem("markets-pivot-watchlists");
      localStorage.removeItem("markets-pivot-portfolio");
      localStorage.removeItem("markets-pivot-screens");
    } catch {
      /* ignore quota / privacy errors */
    }
    log("settings_change", "Account deletion requested");
    logout();
  };

  const handleRevokeSession = (key: string) => {
    setRevokedSessions((prev) => new Set(prev).add(key));
    log("settings_change", `Revoked session: ${key}`);
    showActionMsg(`🚫 Session revoked: ${key}`);
  };

  const handleSignOutAllSessions = () => {
    if (!window.confirm("Sign out of all other sessions?")) return;
    setRevokedSessions(new Set(["iPhone 15 Pro", "iPad Air"]));
    log("settings_change", "Signed out of all other sessions");
    showActionMsg("✅ All other sessions signed out");
  };

  return (
    <div className="page user-profile-page">
      {actionMsg && (
        <div className="profile-toast" role="status" aria-live="polite">
          {actionMsg}
        </div>
      )}
      <section className="coverage-hero profile-hero">
        <div className="profile-identity">
          <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div>
            <p className="eyebrow">{t("userProfile.eyebrowAccount")}</p>
            <h1>{user.name}</h1>
            <p>{user.email} • {user.role}</p>
          </div>
        </div>
        <div className="metric-strip">
          <div className="metric-tile"><span>{t("userProfile.metricPlan")}</span><strong>{user.isAdmin ? "Admin" : "Pro"}</strong></div>
          <div className="metric-tile"><span>{t("userProfile.metricWatchlists")}</span><strong>{watchlists.length}</strong></div>
          <div className="metric-tile"><span>{t("userProfile.metricPortfolios")}</span><strong>{portfolios.length}</strong></div>
        </div>
      </section>

      <div className="profile-layout">
        <aside className="profile-sidebar">
          {[
            { id: "profile", label: "👤 Profile" },
            { id: "preferences", label: "⚙️ Preferences" },
            { id: "notifications", label: "🔔 Notifications" },
            { id: "privacy", label: "🔒 Privacy" },
            { id: "security", label: "🛡 Security" },
            { id: "sessions", label: "📱 Sessions" },
            { id: "activity", label: "📊 Activity" },
          ].map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id as typeof activeSection)}
              className={activeSection === section.id ? "active" : ""}
            >
              {section.label}
            </button>
          ))}
          <button type="button" onClick={logout} className="logout-btn">{t("userProfile.signOut")}</button>
        </aside>

        <main className="profile-main">
          {activeSection === "profile" && (
            <div className="profile-section">
              <h2>{t("userProfile.profileInfoTitle")}</h2>
              <p className="section-subtitle">{t("userProfile.profileInfoSubtitle")}</p>

              <div className="form-card">
                <div className="form-row">
                  <label>{t("userProfile.labelFullName")}</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-row">
                  <label>{t("userProfile.labelEmail")}</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-row">
                  <label>{t("userProfile.labelRole")}</label>
                  <input type="text" value={user.role} readOnly />
                </div>
                <div className="form-actions">
                  <button onClick={handleSaveProfile} type="button" className="primary-action-sm">{t("userProfile.btnSaveChanges")}</button>
                  <button onClick={() => { setName(user.name); setEmail(user.email); }} type="button" className="secondary-action-sm">{t("userProfile.btnCancel")}</button>
                </div>
              </div>

              <div className="form-card">
                <h3>{t("userProfile.publicProfileTitle")}</h3>
                <p className="section-subtitle">{t("userProfile.publicProfileSubtitle")}</p>
                <div className="toggle-row">
                  <div>
                    <strong>{t("userProfile.publicProfileToggle")}</strong>
                    <span>{t("userProfile.publicProfileDesc")}</span>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={prefs.privacy.publicProfile} onChange={(e) => prefs.updatePrivacy("publicProfile", e.target.checked)} />
                    <span className="slider" />
                  </label>
                </div>
                <div className="toggle-row">
                  <div>
                    <strong>{t("userProfile.showPortfolioToggle")}</strong>
                    <span>{t("userProfile.showPortfolioDesc")}</span>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={prefs.privacy.showPortfolio} onChange={(e) => prefs.updatePrivacy("showPortfolio", e.target.checked)} />
                    <span className="slider" />
                  </label>
                </div>
                <div className="toggle-row">
                  <div>
                    <strong>{t("userProfile.showWatchlistsToggle")}</strong>
                    <span>{t("userProfile.showWatchlistsDesc")}</span>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={prefs.privacy.showWatchlists} onChange={(e) => prefs.updatePrivacy("showWatchlists", e.target.checked)} />
                    <span className="slider" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === "preferences" && (
            <div className="profile-section">
              <h2>{t("userProfile.preferencesTitle")}</h2>
              <p className="section-subtitle">{t("userProfile.preferencesSubtitle")}</p>

              <div className="form-card">
                <h3>{t("userProfile.appearanceTitle")}</h3>
                <div className="form-row">
                  <label>{t("userProfile.labelTheme")}</label>
                  <div className="theme-picker">
                    {(["light", "dark", "system"] as Theme[]).map((theme) => (
                      <button
                        key={theme}
                        type="button"
                        onClick={() => prefs.setTheme(theme)}
                        className={prefs.theme === theme ? "active" : ""}
                      >
                        {theme === "light" ? "☀️" : theme === "dark" ? "🌙" : "⚙️"} {theme}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-row">
                  <label>{t("userProfile.labelLayoutDensity")}</label>
                  <div className="theme-picker">
                    {(["comfortable", "compact"] as const).map((density) => (
                      <button
                        key={density}
                        type="button"
                        onClick={() => prefs.setLayoutDensity(density)}
                        className={prefs.layoutDensity === density ? "active" : ""}
                      >
                        {density}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-card">
                <h3>{t("userProfile.localizationTitle")}</h3>
                <div className="form-row">
                  <label>{t("userProfile.labelLanguage")}</label>
                  <div className="language-row">
                    <LanguageSwitcher />
                    <span className="muted">Current: {language}</span>
                  </div>
                </div>
                <div className="form-row">
                  <label>{t("userProfile.labelBaseCurrency")}</label>
                  <select value={prefs.baseCurrency} onChange={(e) => prefs.setBaseCurrency(e.target.value as typeof prefs.baseCurrency)}>
                    {["USD", "EUR", "GBP", "JPY", "INR", "CNY", "AUD", "CAD"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <label>{t("userProfile.labelDefaultMarket")}</label>
                  <select value={prefs.defaultMarket} onChange={(e) => prefs.setDefaultMarket(e.target.value as typeof prefs.defaultMarket)}>
                    {["Global", "Americas", "Europe", "Asia", "Africa", "Middle East"].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <label>{t("userProfile.labelDefaultLanding")}</label>
                  <select value={prefs.defaultLanding} onChange={(e) => prefs.setDefaultLanding(e.target.value as typeof prefs.defaultLanding)}>
                    {[
                      { value: "dashboard", label: "Dashboard" },
                      { value: "markets", label: "Markets" },
                      { value: "stocks", label: "Stocks" },
                      { value: "forex", label: "FX" },
                      { value: "crypto", label: "Crypto" },
                      { value: "user", label: "User Panel" },
                    ].map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-card">
                <h3>{t("userProfile.riskProfileTitle")}</h3>
                <p className="section-subtitle">{t("userProfile.riskProfileSubtitle")}</p>
                <div className="risk-picker">
                  {(["conservative", "moderate", "aggressive", "speculative"] as RiskProfile[]).map((profile) => (
                    <button
                      key={profile}
                      type="button"
                      onClick={() => prefs.setRiskProfile(profile)}
                      className={prefs.riskProfile === profile ? "active" : ""}
                    >
                      <strong>{profile}</strong>
                      <span>
                        {profile === "conservative" && "Low risk, dividend focus"}
                        {profile === "moderate" && "Balanced growth and income"}
                        {profile === "aggressive" && "Higher risk, growth focus"}
                        {profile === "speculative" && "High risk, momentum trades"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-card">
                <button onClick={() => { prefs.resetAll(); log("settings_change", "All preferences reset to defaults"); }} type="button" className="secondary-action-sm">
                  Reset All Preferences
                </button>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="profile-section">
              <h2>{t("userProfile.notificationsTitle")}</h2>
              <p className="section-subtitle">{t("userProfile.notificationsSubtitle")}</p>

              <div className="form-card">
                <h3>{t("userProfile.notificationTypesTitle")}</h3>
                {[
                  { key: "priceAlerts" as const, label: "Price Alerts", desc: "When watchlist symbols hit target prices" },
                  { key: "earningsAlerts" as const, label: "Earnings Alerts", desc: "Upcoming and reported earnings" },
                  { key: "newsDigest" as const, label: "News Digest", desc: "Daily summary of relevant news" },
                  { key: "weeklyReport" as const, label: "Weekly Report", desc: "Weekly performance summary" },
                  { key: "breakingNews" as const, label: "Breaking News", desc: "Critical market events" },
                  { key: "portfolioAlerts" as const, label: "Portfolio Alerts", desc: "Significant P/L changes" },
                ].map((item) => (
                  <div key={item.key} className="toggle-row">
                    <div>
                      <strong>{item.label}</strong>
                      <span>{item.desc}</span>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={prefs.notifications[item.key]}
                        onChange={(e) => prefs.updateNotification(item.key, e.target.checked)}
                      />
                      <span className="slider" />
                    </label>
                  </div>
                ))}
              </div>

              <div className="form-card">
                <h3>{t("userProfile.notificationChannelsTitle")}</h3>
                <div className="channels-grid">
                  {(["email", "push", "sms", "inApp"] as NotificationChannel[]).map((channel) => (
                    <button
                      key={channel}
                      type="button"
                      onClick={() => prefs.toggleNotificationChannel(channel)}
                      className={prefs.notifications.channels.includes(channel) ? "active" : ""}
                    >
                      {channel === "email" && "📧"}
                      {channel === "push" && "🔔"}
                      {channel === "sms" && "📱"}
                      {channel === "inApp" && "💬"}
                      <strong>{channel}</strong>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-card">
                <h3>{t("userProfile.quietHoursTitle")}</h3>
                <p className="section-subtitle">{t("userProfile.quietHoursSubtitle")}</p>
                <div className="form-row">
                  <label>{t("userProfile.labelFrom")}</label>
                  <input
                    type="time"
                    value={prefs.notifications.quietHoursStart}
                    onChange={(e) => prefs.updateNotification("quietHoursStart", e.target.value)}
                  />
                </div>
                <div className="form-row">
                  <label>{t("userProfile.labelTo")}</label>
                  <input
                    type="time"
                    value={prefs.notifications.quietHoursEnd}
                    onChange={(e) => prefs.updateNotification("quietHoursEnd", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === "privacy" && (
            <div className="profile-section">
              <h2>{t("userProfile.privacyTitle")}</h2>
              <p className="section-subtitle">{t("userProfile.privacySubtitle")}</p>

              <div className="form-card">
                {[
                  { key: "publicProfile" as const, label: "Public Profile", desc: "Allow your profile to be discoverable" },
                  { key: "showPortfolio" as const, label: "Portfolio Visibility", desc: "Show your portfolio to other users" },
                  { key: "showWatchlists" as const, label: "Watchlist Visibility", desc: "Display your saved watchlists" },
                  { key: "allowAnalytics" as const, label: "Analytics", desc: "Help us improve by sharing anonymous usage data" },
                ].map((item) => (
                  <div key={item.key} className="toggle-row">
                    <div>
                      <strong>{item.label}</strong>
                      <span>{item.desc}</span>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={prefs.privacy[item.key]}
                        onChange={(e) => prefs.updatePrivacy(item.key, e.target.checked)}
                      />
                      <span className="slider" />
                    </label>
                  </div>
                ))}
              </div>

              <div className="form-card">
                <h3>{t("userProfile.dataManagementTitle")}</h3>
                <div className="data-actions">
                  <button type="button" className="secondary-action-sm" onClick={handleDownloadData}>{t("userProfile.btnDownloadData")}</button>
                  <button type="button" className="secondary-action-sm danger" onClick={handleDeleteAccount}>{t("userProfile.btnDeleteAccount")}</button>
                </div>
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div className="profile-section">
              <h2>{t("userProfile.securityTitle")}</h2>
              <p className="section-subtitle">{t("userProfile.securitySubtitle")}</p>

              <div className="form-card">
                <h3>{t("userProfile.changePasswordTitle")}</h3>
                <form onSubmit={handlePasswordChange}>
                  <div className="form-row">
                    <label>{t("userProfile.labelCurrentPassword")}</label>
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                  </div>
                  <div className="form-row">
                    <label>{t("userProfile.labelNewPassword")}</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} minLength={8} />
                  </div>
                  <div className="form-row">
                    <label>{t("userProfile.labelConfirmPassword")}</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                  {passwordMsg && (
                    <div className={`form-message ${passwordMsg.type}`}>{passwordMsg.text}</div>
                  )}
                  <div className="form-actions">
                    <button type="submit" className="primary-action-sm">{t("userProfile.btnUpdatePassword")}</button>
                  </div>
                </form>
              </div>

              <div className="form-card">
                <h3>{t("userProfile.twoFactorTitle")}</h3>
                <div className="toggle-row">
                  <div>
                    <strong>{t("userProfile.twoFactorToggle")}</strong>
                    <span>{t("userProfile.twoFactorDesc")}</span>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={prefs.security.twoFactorEnabled} onChange={handleToggle2FA} />
                    <span className="slider" />
                  </label>
                </div>
              </div>

              <div className="form-card">
                <h3>{t("userProfile.sessionSettingsTitle")}</h3>
                <div className="form-row">
                  <label>Session Timeout (minutes)</label>
                  <input
                    type="number"
                    min={5}
                    max={240}
                    value={prefs.security.sessionTimeout}
                    onChange={(e) => prefs.updateSecurity("sessionTimeout", Number(e.target.value))}
                  />
                </div>
                <div className="toggle-row">
                  <div>
                    <strong>{t("userProfile.loginAlertsToggle")}</strong>
                    <span>{t("userProfile.loginAlertsDesc")}</span>
                  </div>
                  <label className="toggle">
                    <input type="checkbox" checked={prefs.security.loginAlerts} onChange={(e) => prefs.updateSecurity("loginAlerts", e.target.checked)} />
                    <span className="slider" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeSection === "sessions" && (
            <div className="profile-section">
              <h2>{t("userProfile.activeSessionsTitle")}</h2>
              <p className="section-subtitle">{t("userProfile.activeSessionsSubtitle")}</p>

              <div className="form-card">
                {[
                  { device: "MacBook Pro 16", browser: "Chrome 120", location: "New York, USA", ip: "192.168.1.42", current: true, when: "Active now" },
                  { device: "iPhone 15 Pro", browser: "Safari 17", location: "New York, USA", ip: "192.168.1.55", current: false, when: "2 hours ago" },
                  { device: "iPad Air", browser: "Safari 17", location: "Brooklyn, USA", ip: "192.168.1.78", current: false, when: "Yesterday" },
                ].map((s, i) => {
                  const isRevoked = revokedSessions.has(s.device);
                  return (
                    <div key={i} className={`session-row${isRevoked ? " revoked" : ""}`} style={isRevoked ? { opacity: 0.5 } : undefined}>
                      <div className="session-icon">{s.device.startsWith("iPhone") ? "📱" : s.device.startsWith("iPad") ? "📱" : "💻"}</div>
                      <div className="session-info">
                        <strong>
                          {s.device}{" "}
                          {s.current && <span className="current-pill">{t("userProfile.sessionCurrent")}</span>}
                          {isRevoked && <span className="current-pill" style={{ background: "#ef4444" }}>{t("userProfile.sessionRevoked")}</span>}
                        </strong>
                        <span>{s.browser} • {s.location} • {s.ip}</span>
                        <em>{s.when}</em>
                      </div>
                      {!s.current && !isRevoked && (
                        <button type="button" className="secondary-action-sm" onClick={() => handleRevokeSession(s.device)}>{t("userProfile.btnRevoke")}</button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="form-card">
                <button type="button" className="secondary-action-sm danger" onClick={handleSignOutAllSessions}>{t("userProfile.btnSignOutAll")}</button>
              </div>
            </div>
          )}

          {activeSection === "activity" && (
            <div className="profile-section">
              <h2>{t("userProfile.activityLogTitle")}</h2>
              <p className="section-subtitle">{t("userProfile.activityLogSubtitle")}</p>

              <div className="form-card">
                <div className="activity-stats">
                  <div><span>{t("userProfile.activityTotal")}</span><strong>{activities.length}</strong></div>
                  <div><span>{t("userProfile.activityToday")}</span><strong>{activities.filter((a) => Date.now() - a.timestamp < 86400000).length}</strong></div>
                  <div><span>{t("userProfile.activityThisWeek")}</span><strong>{activities.filter((a) => Date.now() - a.timestamp < 7 * 86400000).length}</strong></div>
                </div>
                <div className="activity-list">
                  {activities.length === 0 ? (
                    <p className="empty">{t("userProfile.activityEmpty")}</p>
                  ) : (
                    activities.map((a) => (
                      <div key={a.id} className="activity-row">
                        <span className="activity-icon">{ACTIVITY_ICONS[a.type] ?? "•"}</span>
                        <div className="activity-content">
                          <strong>{a.description}</strong>
                          <em>{formatTimestamp(a.timestamp)}</em>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {activities.length > 0 && (
                  <div className="form-actions">
                    <button type="button" onClick={() => clearActivity()} className="secondary-action-sm">{t("userProfile.btnClearActivity")}</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default UserProfilePage;
