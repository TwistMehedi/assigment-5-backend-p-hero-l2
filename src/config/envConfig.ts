import dotenv from "dotenv";

dotenv.config();

interface IEnvConfig {
  DATABASE_URL: string;
  PORT: string;
}

const validateEnv = ["DATABASE_URL", "PORT"] as const;

validateEnv.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing environment variable: ${envVar}`);
  }
});

const envConfig = (): IEnvConfig => ({
  DATABASE_URL: process.env.DATABASE_URL as string,
  PORT: process.env.PORT as string,
});

export const env = envConfig();
