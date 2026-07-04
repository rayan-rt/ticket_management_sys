// Server Layer

import bcrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { AuthService } from "../services/auth.service";
import { ErrorHandler } from "../utils/errHandler";
import { ResHandler } from "../utils/resHandler";
// --

type SignupRequestBody = {
  name: string;
  email: string;
  password: string;
};

type SigninRequestBody = {
  email: string;
  password: string;
};

const JWT_SECRET = String(process.env.JWT_SECRET) || "secret";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "1h";
const tokenName = "accessToken";
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

export class AuthController {
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body as SignupRequestBody;
      const isExist = await AuthService.findUserByEmail(email);
      if (isExist) {
        return next(new ErrorHandler("User already exists", {}, false, 400));
      }

      const hash = await bcrypt.hash(password, 10);
      const user = await AuthService.registerUser(email, hash, name, "user");

      if (!user || !user.profile) {
        return next(new ErrorHandler("User creation failed", {}, false, 500));
      }

      const payload = { id: user.id };
      const options = { expiresIn: JWT_EXPIRE };
      const token = jsonwebtoken.sign(payload, JWT_SECRET, options);

      return res
        .cookie(tokenName, token, cookieOptions)
        .status(201)
        .json(
          new ResHandler("User created successfully", 201, user.profile, true),
        );
    } catch (error) {
      console.error(error);
      return next(
        new ErrorHandler(
          String(error?.message) || "Signup failed",
          { error },
          false,
          500,
        ),
      );
    }
  }

  static async signin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body as SigninRequestBody;
      const user = await AuthService.findUserByEmail(email);
      if (!user) {
        return next(new ErrorHandler("User not found", {}, false, 404));
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next(new ErrorHandler("Invalid credentials", {}, false, 401));
      }

      if (!user.profile) {
        return next(new ErrorHandler("Profile not found", {}, false, 404));
      }

      const payload = { id: user.id };
      const options = { expiresIn: JWT_EXPIRE };
      const token = jsonwebtoken.sign(payload, JWT_SECRET, options);

      return res
        .cookie(tokenName, token, cookieOptions)
        .status(200)
        .json(new ResHandler("LoggedIn successfully", 200, user.profile, true));
    } catch (error) {
      console.error(error);
      return next(
        new ErrorHandler(
          String(error?.message) || "Signin failed",
          { error },
          false,
          500,
        ),
      );
    }
  }

  static async signOut(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie(tokenName);
      return res
        .status(200)
        .json(new ResHandler("LoggedOut successfully", 200, {}, true));
    } catch (error) {
      console.error(error);
      return next(
        new ErrorHandler(
          String(error?.message) || "Signout failed",
          { error },
          false,
          500,
        ),
      );
    }
  }
}
