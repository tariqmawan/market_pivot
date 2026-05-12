import { Router } from "express";

const router = Router();

// Generate synthetic series for a given asset id
const generateSeries = (base = 100, points = 60) => {
  const series: number[] = [];
  let value = base;
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * base * 0.02;
    value = Math.max(0, value + change);
    series.push(Number(value.toFixed(2)));
  }
  return series;
};

router.get("/:assetId", (req, res) => {
  const assetId = req.params.assetId;
  // base can be influenced by query param
  const base = Number(req.query.base) || 100;
  const points = Number(req.query.points) || 60;
  const data = generateSeries(base, points);
  res.json({ success: true, data, timestamp: new Date() });
});

export default router;
