import jwt from "jsonwebtoken";
// --

type JwtPayloadWithId = jwt.JwtPayload & {
  id?: string | number;
};

export type { JwtPayloadWithId };
