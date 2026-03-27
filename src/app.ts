import cors from "cors";
import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { MORGAN_FORMAT } from "./libs/config";

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
console.log("__dirname", __dirname);
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("./uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: true,
  }),
);
app.use(cookieParser());
app.use(morgan(MORGAN_FORMAT));

/**2-sessions**/
// express-session middleware ni o'rnatish, bu middleware sessionlarni boshqarish uchun ishlatiladi. secret sifatida SESSION_SECRET environment variable dan olinadi, cookie ning maxAge ni 6 soatga o'rnatish, store sifatida oldin yaratgan MongoDBStore ni berish, resave va saveUninitialized optionlarini true ga o'rnatish. resave true bo'lsa, har bir request da session saqlanadi, saveUninitialized true bo'lsa, yangi yaratilgan lekin o'zgartirilmagan session ham saqlanadi.
app.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    cookie: {
      maxAge: 1000 * 3600 * 6, //6h
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

export default app;

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
