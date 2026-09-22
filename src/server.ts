// Serverni ishga tushirish uchun kerakli modullarni import qilish
import dotenv from "dotenv";
dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env",
});
import { validateEnv } from "./libs/env";
validateEnv();
import server from "./app";
import mongoose from "mongoose";

// MongoDB ga ulanish. Muvaffaqiyatli bo'lsa serverni ishga tushiramiz,
// aks holda server umuman ko'tarilmaydi (DB'siz "up" ko'rinib qolmasligi uchun).
mongoose
  .connect(process.env.MONGO_URL as string, {})
  .then(() => {
    console.log("MongoDB connection succeed");
    const PORT = process.env.PORT ?? 3003;
    const httpServer = server.listen(PORT, function () {
      console.info(`The server is running on port: ${PORT}`);
      console.info(`Admin project on http://localhost:${PORT}/admin \n`);
    });

    // Graceful shutdown: Ctrl+C (SIGINT) va Docker stop (SIGTERM) uchun.
    let isShuttingDown = false;
    const shutdown = (signal: string) => {
      // npm va node ikkalasi signal olgani uchun ikkinchi chaqiruvni e'tiborsiz qoldiramiz
      if (isShuttingDown) return;
      isShuttingDown = true;
      console.info(`${signal} received, closing server...`);

      // 10 soniyada yopilmasa — majburan chiqamiz
      const forceExit = setTimeout(() => {
        console.warn("Graceful shutdown timed out, forcing exit");
        process.exit(1);
      }, 10000);
      forceExit.unref();

      httpServer.close(() => {
        mongoose.connection.close().finally(() => process.exit(0));
      });

      // Brauzer qoldirgan ochiq (keep-alive) ulanishlarni darhol yopamiz
      httpServer.closeAllConnections();
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  })
  .catch((err) => {
    console.error("ERROR on Connection MongoDB", err);
    process.exit(1);
  });