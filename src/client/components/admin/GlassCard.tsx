import React from "react";

type GlassCardProps = {
  className?: string;
  children: React.ReactNode;
};

export default function GlassCard({ className = "", children }: GlassCardProps) {
  return (
    <div className={`mpa-glass-card ${className}`}>
      <div className="mpa-glass-inner">{children}</div>
    </div>
  );
}

