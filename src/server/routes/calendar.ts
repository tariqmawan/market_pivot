import { Router } from "express";
import type { Request, Response } from "express";
import type { Knex } from "knex";
import { parsePositiveInt, sanitizeShortText } from "../security";
import { requireAdmin } from "../middleware/auth";

export function createRouter(db: Knex) {
  const router = Router();

  // GET /api/calendar — events fetch karo with filters
  router.get("/", async (req: Request, res: Response) => {
    try {
      const { country, impact, category, from, to } = req.query;
      const pageNumber = parsePositiveInt(req.query.page,  1, 1000);
      const pageSize   = parsePositiveInt(req.query.limit, 50);

      let query = db("economic_events");

      if (country)  query = query.whereILike("country", `%${country}%`);
      if (impact)   query = query.where({ impact: String(impact) });
      if (category) query = query.whereILike("category", `%${category}%`);

      // Date range filter
      if (from) query = query.where("eventDate", ">=", new Date(String(from)));
      if (to)   query = query.where("eventDate", "<=", new Date(String(to)));

      // Default: aaj se agle 7 din
      if (!from && !to) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        query = query.where("eventDate", ">=", today).where("eventDate", "<=", nextWeek);
      }

      const [data, [{ count }]] = await Promise.all([
        query.clone().orderBy("eventDate", "asc").orderBy("time", "asc")
          .offset((pageNumber - 1) * pageSize).limit(pageSize),
        query.clone().count("id as count"),
      ]);

      // Date ke hisaab se group karo — frontend ke liye convenient
      const grouped: Record<string, any[]> = {};
      for (const event of data) {
        const dateKey = new Date(event.eventDate).toISOString().split("T")[0];
        if (!grouped[dateKey]) grouped[dateKey] = [];
        grouped[dateKey].push(event);
      }

      res.json({
        success: true,
        data,
        grouped,
        pagination: { page: pageNumber, limit: pageSize, total: Number(count), pages: Math.ceil(Number(count) / pageSize) },
        timestamp: new Date(),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Failed to fetch calendar", timestamp: new Date() });
    }
  });

  // GET /api/calendar/today
  router.get("/today", async (req: Request, res: Response) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const data = await db("economic_events")
        .where("eventDate", ">=", today)
        .where("eventDate", "<",  tomorrow)
        .orderBy("time", "asc");

      const highCount = data.filter((e: any) => e.impact === "High").length;

      res.json({ success: true, data, meta: { highImpactCount: highCount }, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch today events", timestamp: new Date() });
    }
  });

  // GET /api/calendar/upcoming — agle 30 din ke high impact events
  router.get("/upcoming", async (req: Request, res: Response) => {
    try {
      const today = new Date();
      const next30 = new Date(today);
      next30.setDate(next30.getDate() + 30);

      const data = await db("economic_events")
        .where("eventDate", ">=", today)
        .where("eventDate", "<=", next30)
        .where({ impact: "High" })
        .orderBy("eventDate", "asc")
        .limit(20);

      res.json({ success: true, data, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch upcoming events", timestamp: new Date() });
    }
  });

  // POST /api/calendar — admin: event add karo
  router.post("/", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { title, country, impact, eventDate, time, forecast, previous, category } = req.body;

      if (!title || !country || !impact || !eventDate) {
        return res.status(400).json({
          success: false, error: "title, country, impact, eventDate zaroori hain", timestamp: new Date(),
        });
      }

      const [row] = await db("economic_events")
        .insert({ title, country, impact, eventDate: new Date(eventDate), time, forecast, previous, category: category ?? "general" })
        .returning("*");

      res.status(201).json({ success: true, data: row, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to create event", timestamp: new Date() });
    }
  });

  // PUT /api/calendar/:id — admin: event update karo
  router.put("/:id", requireAdmin, async (req: Request, res: Response) => {
    try {
      const { actual, forecast, previous } = req.body;

      await db("economic_events")
        .where({ id: req.params.id })
        .update({ actual, forecast, previous, updated_at: new Date() });

      res.json({ success: true, data: { message: "Event updated" }, timestamp: new Date() });
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to update event", timestamp: new Date() });
    }
  });

  return router;
}
