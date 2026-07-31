// Serverni ishga tushirish uchun kerakli modullarni import qilish
import dotenv from "dotenv";
dotenv.config();
import { validateEnv } from "./libs/env";
validateEnv();
import app from "./app";
import mongoose from "mongoose";

// Mongoose yordamida MongoDB ga ulanish. MONGO_URL environment variable dan olinadi. Agar ulanish muvaffaqiyatli bo'lsa, serverni belgilangan portda ishga tushirish va konsolga xabar chiqarish. Agar ulanishda xatolik yuz bersa, server ishga tushirilmaydi (avval "up" ko'rinib, lekin DB'siz ishlamay qolishning oldini olish uchun).
mongoose
  .connect(process.env.MONGO_URL as string, {})
  // MongoDB ga ulanish muvaffaqiyatli bo'lsa, serverni belgilangan portda ishga tushirish va konsolga xabar chiqarish.
  .then(() => {
    console.log("MongoDB connection succeed");
    const PORT = process.env.PORT ?? 3003;
    const server = app.listen(PORT, function () {
      console.info(`The server is running on port: ${PORT}`);
      console.info(`Admin project on http://localhost:${PORT}/admin \n`);
    });

    // Container/process manager to'g'ri to'xtatilishi uchun graceful shutdown
    const shutdown = () => {
      console.info("Shutdown signal received, closing server...");
      server.close(() => {
        mongoose.connection.close().finally(() => process.exit(0));
      });
    };
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  })
  .catch((err) => {
    console.error("ERROR on Connection MongoDB", err);
    process.exit(1);
  });
