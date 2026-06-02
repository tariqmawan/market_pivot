import React from "react";

export interface AdminSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
}

export default function AdminSearch({
  value,
  onChange,
  placeholder = "Search…",
  onSubmit,
}: AdminSearchProps) {
  return (
    <input
      type="search"
      className="mp-admin-search"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && onSubmit) onSubmit();
      }}
      aria-label={placeholder}
    />
  );
}
