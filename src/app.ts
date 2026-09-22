import cors from "cors";
import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { MORGAN_FORMAT } from "./libs/config";
import { isProduction, getAllowedOrigins } from "./libs/env";
import { Server as SocketIOServer } from "socket.io";
import http from "http";  

import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session";
import { T } from "./libs/types/common";

// MongoDBStore ni yaratish uchun ConnectMongoDB ni session bilan birga chaqirish.
const MongoDBStore = ConnectMongoDB(session);

// MongoDBStore ni yaratish uchun kerakli konfiguratsiyalarni berish. uri sifatida MONGO_URL environment variable dan olinadi va collection nomi "sessions" deb belgilanadi.
const store = new MongoDBStore({
  uri: String(process.env.MONGO_URL),
  collection: "sessions",
});

/**1-Entrance**/
// Express app ni yaratish va kerakli middleware larni o'rnatish. express.static middleware yordamida public papkasini statik fayllar uchun ishlatish va uploads papkasini rasm fayllari uchun ishlatish. express.urlencoded va express.json middleware larini o'rnatish, bu middleware lar incoming request body ni req.body ga parse qiladi. cookieParser middleware ni o'rnatish, bu middleware cookies ni parse qiladi va req.cookies ga qo'shadi. morgan middleware ni o'rnatish, bu middleware HTTP requestlarni log qiladi va MORGAN_FORMAT formatida loglarni chiqaradi.
const app = express();

// Xavfsizlik headerlari (CSP EJS/inline script ishlatgani uchun bo'shatilgan - kerak bo'lsa keyinchalik qattiqlashtiriladi).
// crossOriginResourcePolicy ham "cross-origin" ga o'rnatildi - aks holda helmet'ning standart
// "same-origin" siyosati backend (masalan port 3003) dan boshqa origindagi frontend (port 3000)
// rasm/uploads fayllarni <img>/CSS background-image orqali yuklashini brauzerda bloklab qo'yadi
// (mahsulot rasmlari umuman ko'rinmay qolishiga sabab bo'lgan aynan shu edi).
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("./uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "2mb" }));

// Production'da faqat ALLOWED_ORIGINS ro'yxatidagi manzillarga ruxsat beriladi.
// Dev muhitida (ALLOWED_ORIGINS berilmagan bo'lsa) barcha originlarga ruxsat qoladi.
const allowedOrigins = getAllowedOrigins();
app.use(
  cors({
    credentials: true,
    origin:
      isProduction() && allowedOrigins.length > 0
        ? allowedOrigins
        : true,
  }),
);
app.use(cookieParser());
app.use(morgan(MORGAN_FORMAT));

// Login/signup kabi og'ir endpointlarga qo'pol kuch (brute-force) hujumidan himoya
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 daqiqa
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Juda ko'p urinish. Iltimos keyinroq qayta urinib ko'ring." },
});
app.use(["/member/login", "/member/signup", "/admin/login", "/admin/signup"], authLimiter);

app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

/**2-sessions**/
// express-session middleware ni o'rnatish, bu middleware sessionlarni boshqarish uchun ishlatiladi. secret sifatida SESSION_SECRET environment variable dan olinadi, cookie ning maxAge ni 6 soatga o'rnatish, store sifatida oldin yaratgan MongoDBStore ni berish, resave va saveUninitialized optionlarini true ga o'rnatish. resave true bo'lsa, har bir request da session saqlanadi, saveUninitialized true bo'lsa, yangi yaratilgan lekin o'zgartirilmagan session ham saqlanadi.
app.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    cookie: {
      maxAge: 1000 * 3600 * 6, //6h
      httpOnly: true,
      secure: isProduction(),
      sameSite: isProduction() ? "strict" : "lax",
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  }),
);

app.use(function (req, res, next) {
  const sessionInstance = req.session as T;
  res.locals.member = sessionInstance.member;
  next();
});

/**3-views**/
// Express app ning views papkasini __dirname/views ga o'rnatish va view engine sifatida ejs ni belgilash. Bu konfiguratsiya Express ga views papkasida joylashgan EJS fayllarini render qilish imkonini beradi.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/**4-routers**/
// app.use yordamida routerAdmin ni "/admin" pathiga o'rnatish, bu routerAdmin ning barcha route lari "/admin" prefixi bilan ishlaydi. app.use yordamida router ni "/" pathiga o'rnatish, bu router ning barcha route lari asosiy pathda ishlaydi. routerAdmin SSR uchun EJS fayllarini render qiladi, router esa SPA uchun React ga xizmat qiladi.
app.use("/admin", routerAdmin); //SSR: EJS
app.use("/", router); //SPA: REACT

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

let summaryClient = 0;
io.on("connection", (socket) => {
  summaryClient++;
  console.log(`Total connected clients: [${summaryClient}]`);

  socket.on("disconnect", () => {
    summaryClient--;
    console.log(`Total connected clients: [${summaryClient}]`);
  });
});

export default server;

/*
BACKEND da oldi berdi Json formatda boladi
JSON -(JavaScript Object Notation)
commonly between a server and web applications.

PATTERNS > ARCHITECTURE & DeSIGN  
AUTHENTICATION/AUTHORIZATION > session vs token
FRONtEND DEVELOP > BSSR(EJS) va SPA(React)

API REQUEST >
  TYPE > Traditional API(ejs) | Rest API(json) | GraphQL API
  METHOD > GET | POST 
  STRUCTURE > header | body

VALIDATIONS >
 FRONTEND | 
 BACKEND | Module ichida shartga to'g'ri kelmasa
 DATABASE | > Databasedagi talabga to'g'ri kelmasa

*/
