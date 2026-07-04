import "dotenv/config";
import app from "./server";
import { prisma } from "./lib/prisma";

const PORT: number = Number(process.env.PORT) || 3000;

try {
  console.log("connecting to Database...");

  prisma.$connect();
  console.log("Database connected successfully");

  app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
} catch (error) {
  console.error(error);
  process.exit(1);
}
