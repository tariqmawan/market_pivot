import React from "react";
import newsData from "../../data/news.json";
import { Link } from "react-router-dom";
import "./News.css";

const NewsPage: React.FC = () => {
  const articles = (newsData as any).articles as any[];
  // sort by publishedAt desc
  const sorted = [...articles].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const featured = sorted[0];
  const rest = sorted.slice(1);

  const trending = sorted.slice(0, 5);

  React.useEffect(() => {
    document.title = `Latest News — MarketsPivot`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', 'Latest market news and headlines from MarketsPivot');
  }, []);

  return (
    <div className="news-page">
      <main>
        {featured && (
          <article className="featured-article">
            {featured.image && <img src={featured.image} alt={featured.title} />}
            <div className="featured-body">
              <p style={{ color: '#888', margin: 0, fontSize: 13 }}>{featured.source} • {new Date(featured.publishedAt).toLocaleString()}</p>
              <h1>{featured.title}</h1>
              <p>{featured.summary}</p>
              <Link to={`/news/${featured.id}`}>Read more →</Link>
            </div>
          </article>
        )}

        <section className="article-list">
          {rest.map((a) => (
            <article key={a.id} className="article-card">
              <img src={a.image} alt={a.title} />
              <div>
                <h4><Link to={`/news/${a.id}`}>{a.title}</Link></h4>
                <p>{a.summary}</p>
                <small style={{ color: '#999' }}>{a.source} • {new Date(a.publishedAt).toLocaleTimeString()}</small>
              </div>
            </article>
          ))}
        </section>
      </main>

      <aside className="sidebar">
        <div className="trending">
          <h3>Latest</h3>
          <ul>
            {trending.map((t) => (
              <li key={t.id}><strong>{t.title}</strong><div style={{ color: '#666', fontSize: 12 }}>{t.source} • {new Date(t.publishedAt).toLocaleTimeString()}</div></li>
            ))}
          </ul>
        </div>

        <div className="topics">
          <h3>Topics</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[...new Set(articles.flatMap((a: any) => a.tags))].map((tag) => (
              <span key={tag} style={{ background: '#f4f4f4', padding: '6px 8px', borderRadius: 4, fontSize: 13 }}>{tag}</span>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default NewsPage;
