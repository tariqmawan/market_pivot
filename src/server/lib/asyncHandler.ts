import type { Request, Response, NextFunction, RequestHandler } from "express";

/** Wraps async route handlers so rejections reach Express error middleware. */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
