import path from "node:path";
import { pathToFileURL } from "node:url";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";

config();

export async function bootstrapAdmin(prisma, env = process.env) {
  const email = env.ADMIN_EMAIL;
  const password = env.ADMIN_PASSWORD;
  const phoneNumber = env.ADMIN_PHONE;
  const fullName = env.ADMIN_FULL_NAME || "MotorMart Admin";

  if (!email || !password || !phoneNumber) {
    throw new Error(
      "ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_PHONE are required to bootstrap an admin",
    );
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  return prisma.user.upsert({
    where: { email },
    update: {
      fullName,
      phoneNumber,
      password: hashedPassword,
      role: "admin",
    },
    create: {
      fullName,
      email,
      phoneNumber,
      password: hashedPassword,
      role: "admin",
    },
  });
}

const invokedDirectly =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (invokedDirectly) {
  const prisma = new PrismaClient();
  bootstrapAdmin(prisma)
    .then(() => {
      console.log("Bootstrap admin is ready");
    })
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
