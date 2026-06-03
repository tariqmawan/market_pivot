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
  placeholder,
  onSubmit,
}: AdminSearchProps) {
  const resolvedPlaceholder = placeholder ?? "Search...";
  return (
    <input
      type="search"
      className="mp-admin-search"
      value={value}
      placeholder={resolvedPlaceholder}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && onSubmit) onSubmit();
      }}
      aria-label={resolvedPlaceholder}
    />
  );
}
