import { Router } from "express";
import type { Request, Response } from "express";
import type { ApiResponse, MarketRegion, PaginatedResponse } from "../../types";
import regionsData from "../../data/regions.json";
import { parsePositiveInt } from "../security";
const router = Router();
const regions = regionsData.regions as unknown as MarketRegion[];

router.get("/", async (req: Request, res: Response<PaginatedResponse<MarketRegion>>) => {
  try {
    const pageNumber = parsePositiveInt(req.query.page, 1, 1000);
    const pageSize = parsePositiveInt(req.query.limit, 20);
    const group = typeof req.query.group === "string" ? req.query.group : "";
    const allRegions = regions.filter((region) => !group || region.group === group);
    const data = allRegions.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

    res.json({
      success: true,
      data,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total: allRegions.length,
        pages: Math.ceil(allRegions.length / pageSize),
      },
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch regions",
      timestamp: new Date(),
    } as any);
  }
});

router.get("/:id", async (req: Request, res: Response<ApiResponse<MarketRegion>>) => {
  try {
    const { id } = req.params;
    const region = regions.find((item) => item.id.toLowerCase() === id.toLowerCase());

    if (!region) {
      res.status(404).json({
        success: false,
        error: "Region not found",
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      data: region,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch region",
      timestamp: new Date(),
    });
  }
});

export default router;
