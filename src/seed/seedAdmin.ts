import { UserRole } from "@prisma/client";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

const adminData = {
  name: "Admin",
  email: "nifiro5323@nazisat.com",
  password: "AdminPassword1@#",
  role: UserRole.ADMIN,
};

const seedAdmin = async () => {
  try {
    console.log("🚀 Checking if admin exists...");

    const adminExists = await prisma.user.findFirst({
      where: {
        email: adminData.email,
      },
    });

    if (adminExists) {
      console.log("⚠️ Admin already exists. Task skipped.");
      return;
    }

    console.log("🌱 Creating admin via Better-Auth API...");
    const createAdmin = await auth.api.signUpEmail({
      body: {
        name: adminData.name,
        email: adminData.email,
        password: adminData.password,
        role: adminData.role,
      },
    });

    if (!createAdmin) {
      throw new Error("Failed to create admin account.");
    }

    console.log("🔧 Verifying admin and setting role...");
    await prisma.user.update({
      where: {
        email: adminData.email,
      },
      data: {
        emailVerified: true,
        hasPassword: true,
      },
    });

    console.log("✅ Admin created successfully via Command Line!");
  } catch (error) {
    console.error("❌ Error seeding admin:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seedAdmin();
