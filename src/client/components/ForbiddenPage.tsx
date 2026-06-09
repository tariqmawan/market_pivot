import React from "react";
import { Link } from "react-router-dom";
import EmptyState from "./EmptyState";
import { useI18n } from "../i18n";



/**
 * Reusable 403 / forbidden screen — used by admin guard when the user is
 * authenticated but lacks the required permission.
 */
const ForbiddenPage: React.FC<{ message?: string }> = ({ message }) => {
  const { t } = useI18n();
  return (
  <div className="page">
    <EmptyState
      icon="🛡"
      title={t("forbiddenpage.h0")}
      description={
        message ?? t("forbiddenpage.description")
      }
      secondary={
        <Link to="/" className="primary-action" style={{ textDecoration: "none" }}>
          ← {t("forbiddenpage.backToHome")}
        </Link>
      }
    />
  </div>
  );
};

export default ForbiddenPage;
