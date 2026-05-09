import { Router } from "express";
import type { Request, Response } from "express";
import type { ApiResponse, PaginatedResponse, StockSector } from "../../types";
import sectorsData from "../../data/sectors.json";
import { parsePositiveInt } from "../security";

const router = Router();
const sectors = sectorsData.sectors as StockSector[];

router.get("/", async (req: Request, res: Response<PaginatedResponse<StockSector>>) => {
  try {
    const pageNumber = parsePositiveInt(req.query.page, 1, 1000);
    const pageSize = parsePositiveInt(req.query.limit, 20);
    const category = typeof req.query.category === "string" ? req.query.category : "";
    const allSectors = sectors.filter((sector) => !category || sector.category === category);
    const data = allSectors.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

    res.json({
      success: true,
      data,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total: allSectors.length,
        pages: Math.ceil(allSectors.length / pageSize),
      },
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch sectors",
      timestamp: new Date(),
    } as any);
  }
});

router.get("/:id", async (req: Request, res: Response<ApiResponse<StockSector>>) => {
  try {
    const { id } = req.params;
    const sector = sectors.find((item) => item.id.toLowerCase() === id.toLowerCase());

    if (!sector) {
      res.status(404).json({
        success: false,
        error: "Sector not found",
        timestamp: new Date(),
      });
      return;
    }

    res.json({
      success: true,
      data: sector,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch sector",
      timestamp: new Date(),
    });
  }
});

export default router;
