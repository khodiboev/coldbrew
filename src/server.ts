// Serverni ishga tushirish uchun kerakli modullarni import qilish
import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import mongoose from "mongoose";

// Mongoose yordamida MongoDB ga ulanish. MONGO_URL environment variable dan olinadi. Agar ulanish muvaffaqiyatli bo'lsa, serverni belgilangan portda ishga tushirish va konsolga xabar chiqarish. Agar ulanishda xatolik yuz bersa, xatolikni konsolga chiqarish.
mongoose
  .connect(process.env.MONGO_URL as string, {})
  // MongoDB ga ulanish muvaffaqiyatli bo'lsa, serverni belgilangan portda ishga tushirish va konsolga xabar chiqarish.
  .then((data) => {
    console.log("MongoDB connection succeed");
    const PORT = process.env.PORT ?? 3003;
    app.listen(PORT, function () {
      console.info(`The server is running on port: ${PORT}`);
      console.info(`Admin project on http://localhost:${PORT}/admin \n`);
    });
  })
  .catch((err) => console.log("ERROR on Connection MongoDB", err));
