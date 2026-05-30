import React from "react";

type GlassCardProps = {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
};

export default function GlassCard({ className = "", children, style }: GlassCardProps) {
  return (
    <div className={`mpa-glass-card ${className}`} style={style}>
      <div className="mpa-glass-inner">{children}</div>
    </div>
  );
}

