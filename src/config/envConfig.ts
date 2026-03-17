import dotenv from "dotenv";

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
}

const validateEnv = [
  "DATABASE_URL",
  "PORT",
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
  "NODE_ENV",
  "USER_EMAIL",
  "USER_PASS",
] as const;

validateEnv.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing environment variable: ${envVar}`);
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
});

export const env = envConfig();
