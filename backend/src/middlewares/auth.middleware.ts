import type { NextFunction, Request, Response } from "express";
import { ResHandler } from "../utils/resHandler";
import jsonwebtoken from "jsonwebtoken";
import type { User } from "../generated/prisma/client";
import { AuthService } from "../services/auth.service";
import { ErrorHandler } from "../utils/errHandler";
import type { JwtPayloadWithId } from "../types";
import { JWTService } from "../services/jwt.service";
// --

type AuthenticatedRequest = Request & {
  cookies?: Record<string, string>;
  user?: Partial<User>;
};

const JWT_SECRET = String(process.env.JWT_SECRET) || "secret";

export class AuthMiddleware {
  static async authenticate(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json(new ResHandler("Unauthorized", 401, null, false));
    }

    let payload: JwtPayloadWithId;

    const jwtService = new JWTService();

    try {
      payload = jwtService.verify(token) as JwtPayloadWithId;
    } catch (error) {
      console.error(error);
      return res
        .status(401)
        .json(new ResHandler("Unauthorized", 401, { error }, false));
    }

    const userId = Number(payload.id);

    if (!userId || Number.isNaN(userId)) {
      return res
        .status(401)
        .json(new ResHandler("Unauthorized", 401, null, false));
    }

    const signedInUser: Partial<User> | null =
      await AuthService.findUserById(userId);

    if (!signedInUser) {
      return next(new ErrorHandler("Unauthorized", null, false, 401));
    }

    req.user = signedInUser;

    next();
  }
}
