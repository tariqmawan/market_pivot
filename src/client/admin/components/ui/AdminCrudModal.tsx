import React from "react";
import { useI18n } from "../../../i18n";

export interface AdminCrudModalProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  onSave?: () => void;
  saveLabel?: string;
  saving?: boolean;
  destructive?: boolean;
  children: React.ReactNode;
  width?: number;
  hideFooter?: boolean;
}

export default function AdminCrudModal({
  open,
  title,
  subtitle,
  onClose,
  onSave,
  saveLabel = "Save",
  saving,
  destructive,
  children,
  width = 720,
  hideFooter,
}: AdminCrudModalProps) {
  const { t } = useI18n();
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="mp-admin-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="mp-admin-modal"
        style={{ maxWidth: width, width: "100%" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ margin: 0, color: "#f8fafc", fontSize: 17, fontWeight: 900 }}>
            {title}
          </h3>
          {subtitle && (
            <p
              style={{
                margin: "4px 0 0",
                color: "rgba(248,250,252,0.6)",
                fontSize: 13,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        <div style={{ display: "grid", gap: 12 }}>{children}</div>

        {!hideFooter && (
          <div className="mp-admin-modal-actions" style={{ marginTop: 18 }}>
            {onSave && (
              <button
                type="button"
                className="mp-admin-action-btn"
                onClick={onSave}
                disabled={saving}
                style={
                  destructive
                    ? {
                        background: "rgba(239,68,68,0.18)",
                        color: "#ff9090",
                        border: "1px solid rgba(239,68,68,0.32)",
                      }
                    : undefined
                }
              >
                {saving ? t("saving") : saveLabel}
              </button>
            )}
            <button
              type="button"
              className="mp-admin-link-btn"
              onClick={onClose}
              disabled={saving}
            >
              {t("cancel")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
