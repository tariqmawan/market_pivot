import React from "react";
import { useParams, Link } from "react-router-dom";
import newsData from "../../data/news.json";
import { useI18n } from "../i18n";



const ArticlePage: React.FC = () => {
  const { t } = useI18n();
  const { id } = useParams<{ id: string }>();
  const articles = (newsData as any).articles as any[];
  const article = articles.find((a) => a.id === id);

  React.useEffect(() => {
    if (article) {
      document.title = `${article.title} — MarketsPivot`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", article.summary || "Latest market news");
    }
  }, [article]);

  if (!article) {
    return (
      <div className="page">
        <div className="section-heading">
          <h1>{t("article.h0_l22")}</h1>
          <p>{t("article.h1")}</p>
          <Link to="/news">{t("article.h2")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: 920, margin: "36px auto", padding: "0 16px" }}>
      <article style={{ background: "white", padding: 20, borderRadius: 8, boxShadow: "0 6px 24px rgba(0,0,0,0.06)" }}>
        {article.image && <img src={article.image} alt={article.title} style={{ width: "100%", height: 360, objectFit: "cover", borderRadius: 6 }} />}
        <h1 style={{ marginTop: 12 }}>{article.title}</h1>
        <p style={{ color: '#777' }}>{article.source} • {new Date(article.publishedAt).toLocaleString()}</p>
        <p style={{ lineHeight: 1.8 }}>{article.summary}</p>
        <p>{t("article.h0_l41")} <a href={article.url} target="_blank" rel="noreferrer">{t("article.h4")}</a></p>
      </article>
    </div>
  );
};

export default ArticlePage;
