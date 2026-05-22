import { Router } from "express";
import type { Request, Response } from "express";
import type { ApiResponse, Commodity, PaginatedResponse } from "../../types";
import { parsePositiveInt } from "../security.ts";


import fs from "fs";
import path from "path";

const router = Router();

const readJson = (relPath: string) => JSON.parse(fs.readFileSync(path.resolve(__dirname, relPath), "utf8"));
const commoditiesData = readJson("../../data/commodities.json");
const commodities = commoditiesData.commodities as Commodity[];

router.get("/", async (req: Request, res: Response<PaginatedResponse<Commodity>>) => {
  try {
    const pageNumber = parsePositiveInt(req.query.page, 1, 1000);
    const pageSize = parsePositiveInt(req.query.limit, 20);
    const category = typeof req.query.category === "string" ? req.query.category : "";
    const allCommodities = commodities.filter((commodity) => !category || commodity.category === category);
    const data = allCommodities.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

    res.json({
      success: true,
      data,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total: allCommodities.length,
        pages: Math.ceil(allCommodities.length / pageSize),
      },
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch commodities",
      timestamp: new Date(),
    } as any);
  }
});

router.get("/:id", async (req: Request, res: Response<ApiResponse<Commodity>>) => {
  try {
    const { id } = req.params;
    const commodity = commodities.find(
      (item) => item.id.toLowerCase() === id.toLowerCase() || item.symbol.toLowerCase() === id.toLowerCase()
    );

    if (!commodity) {
      res.status(404).json({
        success: false,
        error: "Commodity not found",
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      data: commodity,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch commodity",
      timestamp: new Date(),
    });
  }
});

export default router;
