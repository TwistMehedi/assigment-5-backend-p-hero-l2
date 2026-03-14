import app from "./app";
import { prisma } from "./lib/prisma";

const port = process.env.PORT || 3000;
export const boostrap = async () => {
  try {
    await prisma.$connect();
    console.log("Prisma connected database");
    // app.listen()
    app.listen(port, async () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    await prisma.$disconnect();
    console.log("Prisma connection problem", error);
    process.exit(1);
  }
};

boostrap();
