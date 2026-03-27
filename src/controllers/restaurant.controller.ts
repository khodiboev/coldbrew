import { Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import { AdminRequest, LoginInput, MemberInput } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Errors";

const memberService = new MemberService();

// Restaurant controller
const restaurantController: T = {};

// Restaurant controller objectining goHome metodini yaratamiz va unda req va res parametrlarini mavjud qilamiz. Bu metod foydalanuvchini home sahifasiga yo'naltirish uchun ishlatiladi.
restaurantController.goHome = (req: Request, res: Response) => {
  try {
    console.log("goHome");
    // home sahifasini render qilish uchun res.render metodidan foydalanamiz. Bu metod home nomli view faylini topib, uni foydalanuvchiga ko'rsatadi.
    res.render("home");
    //send | json | redirect | end | render
  } catch (err) {
    console.log("Error, goHome", err);
    // Agar xatolik yuz bersa, foydalanuvchini admin sahifasiga yo'naltiramiz. Bu yerda res.redirect metodidan foydalanamiz, bu metod foydalanuvchini ko'rsatilgan URL manziliga yo'naltiradi.
    res.redirect("/admin");
  }
};

restaurantController.getLogin = (req: Request, res: Response) => {
  try {
    console.log("getLogin");
    res.render("login");
  } catch (err) {
    console.log("Error, getLogin", err);
    res.redirect("/admin");
  }
};

restaurantController.getSignup = (req: Request, res: Response) => {
  try {
    console.log("getSignup");
    res.render("signup");
  } catch (err) {
    console.log("Error, getSignup", err);
    res.redirect("/admin");
  }
};

// ====================================================================

// Restaurant controller objectining processSignup asinxron metodini yaratamiz va unda req va res parametrlarini mavjud qilamiz.
restaurantController.processSignup = async (
  req: AdminRequest,
  res: Response,
) => {
  try {
    console.log("processSignup");
    // req.file orqali foydalanuvchi tomonidan yuklangan faylni olishga harakat qilamiz. Agar fayl mavjud bo'lmasa, xatolik yuz beradi va foydalanuvchiga xabar beriladi.
    const file = req.file;
    if (!file)
      throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG);

    // req.body orqali foydalanuvchi tomonidan yuborilgan ma'lumotlarni olishga harakat qilamiz. Bu ma'lumotlar MemberInput tipida bo'lishi kerak. Agar ma'lumotlar noto'g'ri bo'lsa, xatolik yuz beradi va foydalanuvchiga xabar beriladi.
    const newMember: MemberInput = req.body;
    // Yuklangan faylning yo'lini olish va uni newMember obyektining memberImage xususiyatiga o'rnatish. Fayl yo'lidagi backslashlarni (\\) forward slashlarga (/) almashtirish, bu URL formatiga mos kelishini ta'minlash uchun amalga oshiriladi.
    newMember.memberImage = file?.path.replace(/\\/g, "/");
    newMember.memberType = MemberType.RESTAURANT;
    // memberService obyektining processSignup metodini chaqiramiz va unga newMember obyektini uzatamiz.
    const result = await memberService.processSignup(newMember);

    //TODO: set session

    // Foydalanuvchi muvaffaqiyatli ro'yxatdan o'tgandan so'ng, uning ma'lumotlarini sessiyaga saqlaymiz. Bu orqali foydalanuvchi keyingi so'rovlarida autentifikatsiya qilinadi va unga mos ruxsatlar beriladi.
    req.session.member = result;
    req.session.save(function () {
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("Error, processSignup", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/signup');</script>`,
    );
  }
};

restaurantController.processLogin = async (
  req: AdminRequest,
  res: Response,
) => {
  try {
    console.log("processLogin");
    const input: LoginInput = req.body;
    const result = await memberService.processLogin(input);

    //TODO: Session auth
    req.session.member = result;
    req.session.save(function () {
      res.redirect("/admin/product/all");
    });
  } catch (err) {
    console.log("Error, processLogin", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/login');</script>`,
    );
  }
};

restaurantController.logout = async (req: AdminRequest, res: Response) => {
  try {
    console.log("processLogin");
    req.session.destroy(function (err) {
      res.redirect("/admin");
    });
  } catch (err) {
    console.log("Error, processLogin", err);
    res.redirect("/admin");
  }
};

restaurantController.getUsers = async (req: Request, res: Response) => {
  try {
    console.log("getUsers");
    const result = await memberService.getUsers();

    res.render("users", { users: result });
  } catch (err) {
    console.log("Error, getUsers", err);
    res.redirect("/admin/login");
  }
};

restaurantController.updateChosenUser = async (req: Request, res: Response) => {
  try {
    console.log("updateChosenUser");
    const result = await memberService.updateChosenUser(req.body);

    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error, updateChosenUser", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// restaurantController objectining checkAuthSession asinxron metodini yaratamiz va unda req va res parametrlarini mavjud qilamiz. Bu metod foydalanuvchining sessiyasini tekshirish uchun ishlatiladi.
restaurantController.checkAuthSession = async (
  req: AdminRequest,
  res: Response,
) => {
  try {
    console.log("checkAuthSession");

    if (req.session.member)
      res.send(
        `<script> alert("Hi ${req.session.member.memberNick}, you are logged in.")</script>`,
      );
    else res.send(`<script> alert("${Message.NOT_AUTHENTICATED}")</script>`);
  } catch (err) {
    console.log("Error, checkAuthSession", err);
    res.send(err);
  }
};

// restaurantController objectining verifyRestaurant metodini yaratamiz va unda req, res va next parametrlarini mavjud qilamiz. Bu metod foydalanuvchining restoran ro'yxatdan o'tganligini tekshirish uchun ishlatiladi. Agar foydalanuvchi restoran bo'lsa, uning ma'lumotlarini req.member ga saqlaymiz va next() funksiyasini chaqiramiz, bu esa keyingi middleware yoki controllerga o'tishni ta'minlaydi. Agar foydalanuvchi restoran bo'lmasa, unga autentifikatsiya qilinmaganligi haqida xabar beramiz va login sahifasiga yo'naltiramiz.
restaurantController.verifyRestaurant = (
  req: AdminRequest,
  res: Response,
  next: Function,
) => {
  if (req.session.member?.memberType === MemberType.RESTAURANT) {
    req.member = req.session.member;
    next();
  } else {
    const message = Message.NOT_AUTHENTICATED;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/login');</script>`,
    );
  }
};
export default restaurantController;
