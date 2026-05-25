import React from "react";

export default function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mp-admin-titlebar">
      <div>
        <h1 className="mp-admin-page-title">{title}</h1>
        {subtitle ? <p className="mp-admin-page-sub">{subtitle}</p> : null}
      </div>
      {actions ? <div className="mp-admin-titlebar-actions">{actions}</div> : null}
    </div>
  );
}
