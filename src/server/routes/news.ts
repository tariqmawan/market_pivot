import { Router } from "express";
import newsData from "../../data/news.json";

const router = Router();

const articles = (newsData as any).articles || [];

router.get("/", (req, res) => {
  const limit = Number(req.query.limit) || 50;
  const sorted = [...articles].sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  res.json({ success: true, data: sorted.slice(0, limit), timestamp: new Date() });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  const found = articles.find((a: any) => a.id === id);
  if (!found) return res.status(404).json({ success: false, error: "Article not found", timestamp: new Date() });
  res.json({ success: true, data: found, timestamp: new Date() });
});

export default router;
