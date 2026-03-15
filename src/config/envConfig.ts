import dotenv from "dotenv";

dotenv.config();

type envarnMent = "development" | "test" | "production";

interface IEnvConfig {
  DATABASE_URL: string;
  PORT: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  NODE_ENV: string;
}

const validateEnv = [
  "DATABASE_URL",
  "PORT",
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
  "NODE_ENV",
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
});

export const env = envConfig();
