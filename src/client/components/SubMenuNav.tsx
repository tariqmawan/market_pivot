import React from "react";
import { Link, useLocation } from "react-router-dom";

interface SubMenuItem {
  label: string;
  path: string;
  icon?: string;
}

interface SubMenuNavProps {
  title: string;
  items: SubMenuItem[];
}

const SubMenuNav: React.FC<SubMenuNavProps> = ({ title, items }) => {
  const location = useLocation();

  return (
    <div style={{ marginBottom: "32px", borderBottom: "1px solid #e2e8f0", paddingBottom: "24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <p style={{ fontSize: "11px", fontWeight: 600, color: "#7a8c99", margin: "0 0 12px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
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
                  padding: "8px 16px",
                  borderRadius: "6px",
                  border: isActive ? "2px solid #A27841" : "1px solid #e2e8f0",
                  backgroundColor: isActive ? "rgba(162, 120, 65, 0.1)" : "#f8fafc",
                  color: isActive ? "#A27841" : "#475569",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 500,
                  transition: "all 0.2s",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  if (!isActive) {
                    el.style.borderColor = "#A27841";
                    el.style.backgroundColor = "rgba(162, 120, 65, 0.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  if (!isActive) {
                    el.style.borderColor = "#e2e8f0";
                    el.style.backgroundColor = "#f8fafc";
                  }
                }}
              >
                {item.icon && <span>{item.icon}</span>}
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
