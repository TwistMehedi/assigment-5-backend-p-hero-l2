import app from "./app";
import { env } from "./config/envConfig";
import { prisma } from "./lib/prisma";

export const boostrap = async () => {
  try {
    await prisma.$connect();
    console.log("Prisma connected database");
    app.listen(env.PORT, async () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    await prisma.$disconnect();
    console.log("Prisma connection problem", error);
    process.exit(1);
  }
};

boostrap();
