import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import {
  ExtendedRequest,
  LoginInput,
  Member,
  MemberInput,
  MemberUpdateInput,
} from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import AuthService from "../models/Auth.service";
import { AUTH_TIMER } from "../libs/config";

const memberService = new MemberService();
const authService = new AuthService();

const memberController: T = {};


// memberController objectining getRestaurant methodi, req va res parametrlari mavjud. Bu method restaurant ni olish uchun ishlatiladi.
memberController.getRestaurant = async (req: Request, res: Response) => {
  try {
    console.log("getRestaurant");
    const result = await memberService.getRestaurant();

    res.status(HttpCode.OK).json(result)
  } catch (err) {
    console.log("Error, getRestaurant:", err);

    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
}


// memberController objectining asinxron signup methodi, req va res parametrlari mavjud.
memberController.signup = async (req: Request, res: Response) => {
  try {
    console.log("signup");
    // req.body dan MemberInput tipidagi inputni olish va memberService.signup methodini chaqirish orqali natijani olish.
    const input: MemberInput = req.body,
      // memberService objectining signup methodiga inputni pass qilib, yangi member yaratadi va natijani qaytaradi. Natija Member tipida bo'ladi.
      result: Member = await memberService.signup(input);
    // authService objectining createToken methodiga resultni pass qilib, token yaratadi va natijani qaytaradi. Natija string tipida bo'ladi.
    const token = await authService.createToken(result);

    // Natijani cookie sifatida "accessToken" nomi bilan saqlash, cookie ning maxAge ni AUTH_TIMER * 3600 * 1000 ga o'rnatish va httpOnly ni false qilish. hhtpOnly bu cookie faqat server tomonidan o'qilishi mumkinligini bildiradi, lekin bu yerda false qilib qo'yilgan, ya'ni client tomonidan ham o'qilishi mumkin.
    res.cookie("accessToken", token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
    });

    res.status(HttpCode.CREATED).json({ member: result, accessToken: token });
  } catch (err) {
    console.log("Error, signup:", err);

    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};



memberController.login = async (req: Request, res: Response) => {
  try {
    console.log("login");

    const input: LoginInput = req.body,
      result = await memberService.login(input),
      token = await authService.createToken(result);

    res.cookie("accessToken", token, {
      maxAge: AUTH_TIMER * 3600 * 1000,
      httpOnly: false,
    });

    res.status(HttpCode.OK).json({ member: result, accessToken: token });
  } catch (err) {
    console.log("Error, login:", err);

    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};



// memberController objectining logout methodi, req va res parametrlari mavjud.
memberController.logout = (req: ExtendedRequest, res: Response) => {
  try {
    console.log("logout");
    // "accessToken" nomi bilan cookie ni null qilib, maxAge ni 0 ga o'rnatish orqali cookie ni o'chirish.
    res.cookie("accessToken", null, { maxAge: 0, httpOnly: true });
    res.status(HttpCode.OK).json({ logout: true });
  } catch (err) {
    console.log("Error, logout:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};



// memberController objectining getMemberDetail methodi, req va res parametrlari mavjud.
memberController.getMemberDetail = async (
  req: ExtendedRequest,
  res: Response,
) => {
  try {
    console.log("getMemberDetail");
    // memberService objectining getMemberDetail methodiga req.member ni pass qilib, member detailini olish va natijani qaytarish. Natija Member tipida bo'ladi.
    const result = await memberService.getMemberDetail(req.member);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getMemberDetail:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};



// memberController objectining updateMember methodi, req va res parametrlari mavjud. Nima uchun req ExtendedRequest tipida - chunki member.ts fileda Requestdan interface olganmiz va unda user bitta file yoki birnechta files kiritganini tekshirish uchun.
memberController.updateMember = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("updateMember");
    // postman orqali yuborilgan form-data req.body qismida kirib keladi va uni MemberUpdateInput tipidagi input o'zgaruvchisiga saqlash.
    const input: MemberUpdateInput = req.body;
    // Agar req.file mavjud bo'lsa, input.memberImage ni req.file.path ga o'rnatish. Bu yerda req.file multer middleware tomonidan yaratilgan file obyekti bo'lib, uning path property si file ning saqlangan joyini ko'rsatadi.
    if (req.file) input.memberImage = req.file.path.replace(/\\/g, "/");
    // memberService objectining updateMember methodiga argument sifatida req.member va update bolishi kerak bolgan malumotlar yani input ni pass qilib, member ma'lumotlarini update qilish va natijani qaytarish. Natija Member tipida bo'ladi.
    const result = await memberService.updateMember(req.member, input);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, updateMember:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};



// memberController objectining getTopUsers asinxron methodi, req va res parametrlari mavjud. Bu method top users ni olish uchun ishlatiladi.
memberController.getTopUsers = async (req: Request, res: Response) => {
  try {
    console.log("getTopUsers");
    // Call: memberService objectining getTopUsers methodini chaqirish orqali top users ni olish va natijani qaytarish.
    const result = await memberService.getTopUsers();

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getTopUsers:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};



// memberController objectining verifyAuth methodi, req, res va next parametrlari mavjud. Bu method authenticated bo'lgan userga ruxsat berish uchun ishlatiladi.
memberController.verifyAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies["accessToken"];
    // Agar token mavjud bo'lsa, authService objectining checkAuth methodiga tokenni pass qilib, tokenni tekshirish va agar token valid bo'lsa, req.member ga tekshirilgan member ma'lumotlarini o'rnatish.
    if (token) req.member = await authService.checkAuth(token);

    if (!req.member)
      throw new Errors(HttpCode.UNAUTHORIZED, Message.NOT_AUTHENTICATED);

    next();
  } catch (err) {
    console.log("Error, verifyAuth:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};



// memberController objectining retrieveAuth methodi, req, res va next parametrlari mavjud. Bu method har bir requestda tokenni tekshirish va agar token valid bo'lsa, req.member ga tekshirilgan member ma'lumotlarini o'rnatish uchun ishlatiladi.
memberController.retrieveAuth = async (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // req.cookies dan "accessToken" nomi bilan tokenni olish va agar token mavjud bo'lsa, authService objectining checkAuth methodiga tokenni pass qilib, tokenni tekshirish va agar token valid bo'lsa, req.member ga tekshirilgan member ma'lumotlarini o'rnatish.
    const token = req.cookies["accessToken"];
    if (token) req.member = await authService.checkAuth(token);

    next();
  } catch (err) {
    console.log("Error, retrieveAuth:", err);
    next();
  }
};

export default memberController;
