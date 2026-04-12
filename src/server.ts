import app from "./app";
import { prisma } from "./lib/prisma";

const bootstrap = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected");
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  } catch (error) {
    await prisma.$disconnect();
    console.error("Error connecting to database:", error);
    process.exit(1);
  }
};
bootstrap();

export default app;
