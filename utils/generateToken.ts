import jwt from "jsonwebtoken";

export const generateToken = (payload: JWTPayloadTypes) => {
  return jwt.sign(payload, process.env.JWT_SECRETE!);
};
