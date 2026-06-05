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
      title={t("src_client_components_forbiddenpage__l13__h0")}
      description={
        message ??
        "You don't have permission to view this page. Please contact your administrator if you believe this is a mistake."
      }
      secondary={
        <Link to="/" className="primary-action" style={{ textDecoration: "none" }}>
          ← Back to home
        </Link>
      }
    />
  </div>
  );
};

export default ForbiddenPage;
