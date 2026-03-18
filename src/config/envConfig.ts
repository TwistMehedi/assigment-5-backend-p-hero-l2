import dotenv from "dotenv";
import { ErrorHandler } from "../utils/errorHandler";

dotenv.config();

type envarnMent = "development" | "test" | "production";

interface IEnvConfig {
  DATABASE_URL: string;
  PORT: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  NODE_ENV: string;
  USER_EMAIL: string;
  USER_PASS: string;
  JWT_SECRET_KEY: string;
  JWT_REFRESH_SECRET: string;
  JWT_SESSION_SECRET: string;
}

const validateEnv = [
  "DATABASE_URL",
  "PORT",
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
  "NODE_ENV",
  "USER_EMAIL",
  "USER_PASS",
  "JWT_SECRET_KEY",
  "JWT_REFRESH_SECRET",
  "JWT_SESSION_SECRET",
] as const;

validateEnv.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new ErrorHandler(`Missing environment variable: ${envVar}`, 500);
  }
});

const envConfig = (): IEnvConfig => ({
  DATABASE_URL: process.env.DATABASE_URL as string,
  PORT: process.env.PORT as string,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
  NODE_ENV: process.env.NODE_ENV as envarnMent,
  USER_EMAIL: process.env.USER_EMAIL as string,
  USER_PASS: process.env.USER_PASS as string,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  JWT_SESSION_SECRET: process.env.JWT_SESSION_SECRET as string,
});

export const env = envConfig();
