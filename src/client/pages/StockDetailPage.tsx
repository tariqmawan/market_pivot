import React from "react";
import { useParams, Link } from "react-router-dom";
import stocksData from "../../data/stocks.json";
import StockDetail, { type StockData } from "../components/StockDetail";
import EmptyState from "../components/EmptyState";
import { useI18n } from "../i18n";
import "../components/StockDetail.css";

const stocks = (stocksData as { stocks: StockData[] }).stocks;

const StockDetailPage: React.FC = () => {
  const { symbol } = useParams();
  const { t } = useI18n();
  const stock = stocks.find(
    (s) => s.symbol.toLowerCase() === (symbol ?? "").toLowerCase()
  );

  if (!stock) {
    return (
      <div className="page">
        <EmptyState
          icon="🔎"
          title={t("stockDetail.notFoundTitle")}
          description={t("stockDetail.notFoundBody", { symbol })}
          secondary={
            <Link to="/stocks" className="primary-action" style={{ textDecoration: "none" }}>
              {t("stockDetail.backToStocks")}
            </Link>
          }
        />
      </div>
    );
  }

  return <StockDetail stock={stock} allStocks={stocks} />;
};

export default StockDetailPage;
