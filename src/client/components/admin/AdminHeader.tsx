import React from "react";
import { Link } from "react-router-dom";

function Magnifier() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21 21l-4.35-4.35"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M13.7 21a2 2 0 0 1-3.4 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M12 2c3 3.6 4.5 7.3 4.5 10S15 18.4 12 22c-3-3.6-4.5-7.3-4.5-10S9 5.6 12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AdminHeader({
  onMobileToggle,
  userName = "Admin",
  userEmail,
  onLogout,
}: {
  onMobileToggle: () => void;
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
}) {
  return (
    <header className="mp-admin-header" aria-label="Admin top navigation">
      <button type="button" className="mp-admin-hamburger" onClick={onMobileToggle} aria-label="Open menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 12h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <div className="mp-admin-header-left">
        <div className="mp-admin-search" role="search">
          <span className="mp-admin-search-icon" aria-hidden="true">
            <Magnifier />
          </span>
          <input className="mp-admin-search-input" placeholder="Search analytics, users, events…" />
        </div>
      </div>

      <div className="mp-admin-header-right">
        <button type="button" className="mp-admin-icon-btn" aria-label="Notifications">
          <BellIcon />
        </button>

        <div className="mp-admin-lang">
          <span className="mp-admin-lang-icon" aria-hidden="true">
            <GlobeIcon />
          </span>
          <select className="mp-admin-lang-select" defaultValue="en">
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="fr">FR</option>
          </select>
        </div>

        <div className="mp-admin-user">
          <div className="mp-admin-avatar">{userName.charAt(0).toUpperCase()}</div>
          <div className="mp-admin-user-meta">
            <div className="mp-admin-user-name">{userName}</div>
            <div className="mp-admin-user-role">{userEmail ?? "Admin"}</div>
          </div>
          {onLogout ? (
            <button type="button" className="mp-admin-user-link" onClick={onLogout}>
              Logout
            </button>
          ) : (
            <Link to="/user" className="mp-admin-user-link">Profile</Link>
          )}
        </div>
      </div>
    </header>
  );
}

