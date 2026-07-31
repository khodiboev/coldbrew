import path from "path";
import multer from "multer";
import { v4 } from "uuid";
import fs from "fs";

/**
 * ProductCollection ga qarab papka tanlash.
 * Eslatma: enum nomlari (DISH/SALAD/...) umumiy restoran shabloniga tegishli, lekin
 * mavjud MongoDB ma'lumotlari shu qiymatlar bilan saqlangani uchun enum o'zgartirilmadi -
 * faqat papka mosligi to'g'rilandi va har bir qiymat uchun aniq mapping qo'shildi.
 */
const productFolderMap: Record<string, string> = {
  DRINK: "products/coffee", // kofe ichimliklari
  SALAD: "products/drinks", // gazli suv/choy/sharbat
  DESSERT: "products/desserts", // shirinliklar
  OTHER: "products/bread", // non/pishiriqlar
  DISH: "products/bread", // hozircha alohida papka yo'q, non/pishiriqlar bilan birga saqlanadi
};

/** Umumiy uploader — members kabi statik papkalar uchun */
function getTargetImageStorage(address: string) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const dest = `./uploads/${address}`;
      fs.mkdirSync(dest, { recursive: true });
      cb(null, dest);
    },
    filename: function (req, file, cb) {
      const extension = path.parse(file.originalname).ext;
      const random_name = v4() + extension;
      cb(null, random_name);
    },
  });
}

/** Product uploader — productCollection ga qarab dinamik papka */
function getProductImageStorage() {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const collection = req.body?.productCollection ?? "DRINK";
      const folder = productFolderMap[collection] ?? "products/coffee";
      const dest = `./uploads/${folder}`;
      fs.mkdirSync(dest, { recursive: true }); // papka yo'q bo'lsa yaratadi
      cb(null, dest);
    },
    filename: function (req, file, cb) {
      const extension = path.parse(file.originalname).ext;
      const random_name = v4() + extension;
      cb(null, random_name);
    },
  });
}

const makeUploader = (address: string) => {
  // "products" so'zi kelsa — dinamik storage ishlatiladi
  if (address === "products") {
    const storage = getProductImageStorage();
    return multer({ storage });
  }
  // boshqa holatlar (members va hokazo) — statik papka
  const storage = getTargetImageStorage(address);
  return multer({ storage });
};

export default makeUploader;