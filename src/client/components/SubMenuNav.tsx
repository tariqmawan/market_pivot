import React from "react";
import { Link, useLocation } from "react-router-dom";

interface SubMenuItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface SubMenuNavProps {
  title: string;
  items: SubMenuItem[];
}

const SubMenuNav: React.FC<SubMenuNavProps> = ({ title, items }) => {
  const location = useLocation();

  return (
    <div style={{ marginBottom: "32px", borderBottom: "1px solid #e2e8f0", paddingBottom: "20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <p style={{ fontSize: "10.5px", fontWeight: 700, color: "#94a3b8", margin: "0 0 12px 0", textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {title}
        </p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  padding: "7px 14px",
                  borderRadius: "8px",
                  border: isActive ? "1.5px solid #A27841" : "1px solid #e2e8f0",
                  backgroundColor: isActive ? "rgba(162, 120, 65, 0.1)" : "#fff",
                  color: isActive ? "#A27841" : "#475569",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: isActive ? 700 : 500,
                  transition: "all 0.15s",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: isActive ? "none" : "0 1px 3px rgba(15,23,42,0.05)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  if (!isActive) {
                    el.style.borderColor = "#A27841";
                    el.style.color = "#A27841";
                    el.style.backgroundColor = "rgba(162, 120, 65, 0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  if (!isActive) {
                    el.style.borderColor = "#e2e8f0";
                    el.style.color = "#475569";
                    el.style.backgroundColor = "#fff";
                  }
                }}
              >
                {item.icon && <span style={{ display: "flex", alignItems: "center" }}>{item.icon}</span>}
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SubMenuNav;
