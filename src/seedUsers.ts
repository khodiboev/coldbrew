/**
 * 10 ta test foydalanuvchi (user1..user10) yaratish uchun seed skript.
 * Ishga tushirish: npm run seed:users  (yoki: npx ts-node src/seedUsers.ts)
 *
 * Skript idempotent — memberNick bo'yicha upsert qiladi, shuning uchun
 * xohlagancha marta qayta ishga tushirsangiz ham dublikat yaratmaydi.
 * Parol har safar quyidagi ro'yxatdagi qiymatga qayta o'rnatiladi —
 * ya'ni parolni o'zgartirish uchun shu faylni tahrirlab, skriptni
 * qayta ishga tushirish kifoya.
 */
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import MemberModel from "./schema/Member.model";
import { MemberType, MemberStatus } from "./libs/enums/member.enum";

interface SeedUser {
  memberNick: string;
  memberPhone: string;
  memberPassword: string;
  memberAddress: string;
  memberDesc: string;
  memberImage: string;
  memberPoints: number;
}

const seedUsers: SeedUser[] = [
  {
    memberNick: "user1",
    memberPhone: "01011110001",
    memberPassword: "damir2020",
    memberAddress: "Gangnam-gu, Seoul",
    memberDesc: "Coffee enthusiast who stops by every single morning for an espresso.",
    memberImage: "uploads/members/user1.jpg",
    memberPoints: 145,
  },
  {
    memberNick: "user2",
    memberPhone: "01011110002",
    memberPassword: "damir2020",
    memberAddress: "Mapo-gu, Seoul",
    memberDesc: "Regular customer, always orders the cold brew selection.",
    memberImage: "uploads/members/user2.jpg",
    memberPoints: 98,
  },
  {
    memberNick: "user3",
    memberPhone: "01011110003",
    memberPassword: "damir2020",
    memberAddress: "Jongno-gu, Seoul",
    memberDesc: "Food blogger reviewing lattes and freshly baked croissants.",
    memberImage: "uploads/members/user3.jpg",
    memberPoints: 210,
  },
  {
    memberNick: "user4",
    memberPhone: "01011110004",
    memberPassword: "damir2020",
    memberAddress: "Yongsan-gu, Seoul",
    memberDesc: "Freelance designer who gets the best work done here every week.",
    memberImage: "uploads/members/user4.jpg",
    memberPoints: 62,
  },
  {
    memberNick: "user5",
    memberPhone: "01011110005",
    memberPassword: "damir2020",
    memberAddress: "Seongdong-gu, Seoul",
    memberDesc: "Morning regular — Death Before Decaf, always the Hazelnut Latte.",
    memberImage: "uploads/members/user5.jpeg",
    memberPoints: 176,
  },
  {
    memberNick: "user6",
    memberPhone: "01011110006",
    memberPassword: "damir2020",
    memberAddress: "Songpa-gu, Seoul",
    memberDesc: "Weekend regular, loves trying every new seasonal blend.",
    memberImage: "uploads/members/user6.jpg",
    memberPoints: 34,
  },
  {
    memberNick: "user7",
    memberPhone: "01011110007",
    memberPassword: "damir2020",
    memberAddress: "Gwangjin-gu, Seoul",
    memberDesc: "Student who studies for hours over an Americano and free WiFi.",
    memberImage: "uploads/members/user7.jpg",
    memberPoints: 15,
  },
  {
    memberNick: "user8",
    memberPhone: "01011110008",
    memberPassword: "damir2020",
    memberAddress: "Seodaemun-gu, Seoul",
    memberDesc: "Office worker who grabs a Cappuccino on the way to work daily.",
    memberImage: "uploads/members/user8.jpg",
    memberPoints: 88,
  },
  {
    memberNick: "user9",
    memberPhone: "01011110009",
    memberPassword: "damir2020",
    memberAddress: "Dongjak-gu, Seoul",
    memberDesc: "Photographer who loves the cozy atmosphere for editing shots.",
    memberImage: "uploads/members/user9.jpg",
    memberPoints: 121,
  },
  {
    memberNick: "user10",
    memberPhone: "01011110010",
    memberPassword: "damir2020",
    memberAddress: "Yangcheon-gu, Seoul",
    memberDesc: "Barista-in-training, visits often to study the craft.",
    memberImage: "uploads/members/user10.jpg",
    memberPoints: 5,
  },
];

async function run() {
  await mongoose.connect(String(process.env.MONGO_URL));
  console.log("MongoDB connection succeed");

  for (const user of seedUsers) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.memberPassword, salt);

    await MemberModel.findOneAndUpdate(
      { memberNick: user.memberNick },
      {
        // Parol har safar yangilanadi (masalan hammasini "damir2020" ga
        // qayta o'rnatish kerak bo'lsa, skriptni qayta ishga tushirish kifoya).
        $set: {
          memberPassword: hashedPassword,
        },
        // Qolgan maydonlar faqat birinchi marta (yangi user yaratilganda) o'rnatiladi.
        $setOnInsert: {
          memberType: MemberType.USER,
          memberStatus: MemberStatus.ACTIVE,
          memberNick: user.memberNick,
          memberPhone: user.memberPhone,
          memberAddress: user.memberAddress,
          memberDesc: user.memberDesc,
          memberImage: user.memberImage,
          memberPoints: user.memberPoints,
        },
      },
      { upsert: true, new: true },
    );

    console.log(`✔ ${user.memberNick} tayyor`);
  }

  console.log("\nBarcha 10 ta foydalanuvchi muvaffaqiyatli yaratildi!");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.log("Xatolik:", err);
  process.exit(1);
});
