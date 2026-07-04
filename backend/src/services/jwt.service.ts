import jwt from "jsonwebtoken";
import type { JwtPayloadWithId } from "../types";
// --

const JWT_SECRET = String(process.env.JWT_SECRET) || "secret";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "1h";

class JWTService {
  private secret: string;
  private algorithm: string;

  constructor() {
    this.secret = JWT_SECRET;
    this.algorithm = "HS256";
  }

  sign(payload: JwtPayloadWithId) {
    return jwt.sign(payload, this.secret, {
      algorithm: this.algorithm,
      expiresIn: JWT_EXPIRE,
    });
  }

  verify(token: string) {
    return jwt.verify(token, this.secret);
  }
}

export { JWTService };
