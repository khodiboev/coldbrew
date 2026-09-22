/**
 * Help sahifasidagi Terms & Conditions va FAQ ma'lumotlarini bazaga ko'chirish
 * uchun bir martalik seed skript (ilgari front-endda statik fayllarda turgan
 * matnlarni endi admin panel orqali boshqariladigan bazaga o'tkazish uchun).
 *
 * Ishga tushirish: npm run seed:content  (yoki: npx ts-node src/seedContent.ts)
 *
 * Skript idempotent — termText / faqQuestion bo'yicha upsert qiladi, shuning
 * uchun xohlagancha marta qayta ishga tushirsangiz ham dublikat yaratmaydi.
 */
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import TermModel from "./schema/Term.model";
import FaqModel from "./schema/Faq.model";

const seedTerms: string[] = [
  "By placing an order on ColdBrew, you agree to provide accurate personal and delivery information.",
  "All orders are final once payment has been processed. Please review your order carefully before confirming.",
  "ColdBrew reserves the right to cancel orders in cases of unavailability or suspected fraudulent activity.",
  "Our products contain allergens including dairy, nuts, and gluten. Please inform us of any allergies before ordering.",
  "Personal promotions and discount codes are non-transferable and cannot be combined with other offers.",
  "All user activity on this platform is monitored to ensure a safe and respectful experience for everyone.",
  "ColdBrew is not responsible for delays caused by incorrect delivery addresses provided by the customer.",
];

const seedFaqs: { question: string; answer: string }[] = [
  {
    question: "How do I place an order?",
    answer: "Browse our menu, add your favorite drinks or treats to the basket, and proceed to checkout. It's that simple!",
  },
  {
    question: "How long does delivery take?",
    answer: "Delivery typically takes 20–40 minutes depending on your location. We always aim to deliver your order fresh and on time.",
  },
  {
    question: "Can I customize my coffee order?",
    answer: "Absolutely! You can add notes to your order for special requests such as extra shots, oat milk, less sugar, and more.",
  },
  {
    question: "Is my personal information secure?",
    answer: "Yes, we take full responsibility for your data. All information is encrypted and never shared with third parties.",
  },
  {
    question: "Can I cancel my order?",
    answer: "You can cancel your order within 5 minutes of placing it. After that, our baristas have already started preparing it with love!",
  },
  {
    question: "Do you offer loyalty rewards?",
    answer: "Yes! Every purchase earns you points. Collect enough and enjoy a free drink on us. Check your profile for your rewards balance.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, Kakao Pay, Naver Pay, and cash on delivery.",
  },
];

async function run() {
  await mongoose.connect(String(process.env.MONGO_URL));
  console.log("MongoDB connection succeed");

  for (let i = 0; i < seedTerms.length; i++) {
    await TermModel.findOneAndUpdate(
      { termText: seedTerms[i] },
      { $setOnInsert: { termText: seedTerms[i], termOrder: i + 1 } },
      { upsert: true, new: true },
    );
    console.log(`✔ Term #${i + 1} tayyor`);
  }

  for (let i = 0; i < seedFaqs.length; i++) {
    await FaqModel.findOneAndUpdate(
      { faqQuestion: seedFaqs[i].question },
      {
        $setOnInsert: {
          faqQuestion: seedFaqs[i].question,
          faqAnswer: seedFaqs[i].answer,
          faqOrder: i + 1,
        },
      },
      { upsert: true, new: true },
    );
    console.log(`✔ FAQ #${i + 1} tayyor`);
  }

  console.log("\nTerms va FAQ muvaffaqiyatli bazaga ko'chirildi!");
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.log("Xatolik:", err);
  process.exit(1);
});
