import express from "express";
const router = express.Router();
import memberController from "./controllers/member.controller";
import uploader from "./libs/utils/uploader";
import productController from "./controllers/product.controller";
import orderController from "./controllers/order.controller";

/** Member */
router.get("/member/restaurant", memberController.getRestaurant);

router.post("/member/login", memberController.login);
router.post("/member/signup", memberController.signup);

router.post(
  "/member/logout",
  // Authonticated bo'lgan userga ruxsat berish
  memberController.verifyAuth,
  // Logout qilish uchun controller
  memberController.logout,
);

router.get(
  "/member/detail",
  // Authonticated bo'lgan userga ruxsat berish
  memberController.verifyAuth,
  // Member detailini olish uchun controller
  memberController.getMemberDetail,
);

router.post(
  "/member/update",
  // Authonticated bo'lgan userga ruxsat berish
  memberController.verifyAuth,
  // Rasmni upload qilish uchun middleware
  // "memberImage" nomi bilan rasmni qabul qilib va uni "members" papkasiga saqlash
  uploader("members").single("memberImage"),
  // Member ma'lumotlarini update qilish uchun controller
  memberController.updateMember,
);

// Top users ni olish uchun route. Bu route ga GET request yuborilganda, memberController.getTopUsers methodi chaqiriladi va top users ni qaytaradi.
router.get("/member/top-users", memberController.getTopUsers);

/** Product */

// getProducts route. Bu route ga GET request yuborilganda, productController.getProducts methodi chaqiriladi va products ni qaytaradi. Bu route da query parametrlari orqali products ni filtrlash, sort qilish va pagination qilish mumkin.
router.get("/product/all", productController.getProducts);
router.get(
  "/product/:id",
  memberController.retrieveAuth,
  productController.getProduct,
);

/** Order */

// createOrder route. Bu route ga POST request yuborilganda, memberController.verifyAuth middleware orqali userning authenticated ekanligi tekshiriladi. Agar user authenticated bo'lsa, orderController.createOrder methodi chaqiriladi va yangi order yaratiladi.
router.post(
  "/order/create",
  memberController.verifyAuth,
  orderController.createOrder,
);

// getMyOrders route. Bu route ga GET request yuborilganda, memberController.verifyAuth middleware orqali userning authenticated ekanligi tekshiriladi. Agar user authenticated bo'lsa, orderController.getMyOrders methodi chaqiriladi va userning orderlari qaytariladi. Bu route da query parametrlari orqali orderlarni filtrlash, sort qilish va pagination qilish mumkin.
router.get(
  "/order/all",
  memberController.verifyAuth,
  orderController.getMyOrders,
);

router.post(
  "/order/update",
  memberController.verifyAuth,
  orderController.updateOrder,
);

export default router;
