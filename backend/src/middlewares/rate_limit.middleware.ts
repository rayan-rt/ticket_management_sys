import { rateLimit } from "express-rate-limit";
import type { Request, Response } from "express";
import { ResHandler } from "../utils/resHandler";
// --

const globalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

const authRateLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 3,
  handler(req: Request, res: Response) {
    res
      .status(429)
      .json(
        new ResHandler(
          "Too many requests, please try again later.",
          429,
          null,
          false,
        ),
      );
  },
});

export { globalRateLimit, authRateLimit };
