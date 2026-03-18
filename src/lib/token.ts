import jwt from "jsonwebtoken";
import { env } from "../config/envConfig";

interface IJwtPayload {
  email: string;
  id: string;
  role: string;
}

export const createJwtToken = (user: IJwtPayload) => {
  return jwt.sign(
    {
      email: user.email,
      id: user.id,
      role: user.role,
    },
    env.JWT_SECRET_KEY,
    {
      expiresIn: "1d",
    },
  );
};

export const createRefreshToken = (user: IJwtPayload) => {
  return jwt.sign(
    {
      email: user.email,
      id: user.id,
      role: user.role,
    },
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: "7d",
    },
  );
};
