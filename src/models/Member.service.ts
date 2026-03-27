import MemberModel from "../schema/Member.model";
import {
  LoginInput,
  Member,
  MemberInput,
  MemberUpdateInput,
} from "../libs/types/member";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import bcrypt from "bcryptjs";
import { shapeIntoMongooseObjectId } from "../libs/config";

class MemberService {
  private readonly memberModel;

  constructor() {
    this.memberModel = MemberModel;
  }

  /** SPA */

  // memberService objectining asinxron getRestaurant methodi. Asinxron bolgani uchun Member tipida bo'lgan datani qaytaradi.
  public async getRestaurant(): Promise<Member> {
    // memberModel ning findOne methodini chaqirish orqali memberTypei RESTAURANT ga teng bo'lgan member ni topish. Natijani result o'zgaruvchisiga saqlash. Agar result topilmasa, HttpCode.NOT_FOUND va Message.NO_DATA_FOUND bilan yangi Errors ni throw qilish. Bu yerda RESTAURANT tipidagi member faqat bitta bo'lishi mumkinligi tekshirilmoqda.
    const result = await this.memberModel
      .findOne({ MemberType: MemberType.RESTAURANT })
      // lean() methodi Mongoose document ni oddiy JavaScript object ga aylantiradi. Bu, agar sizga Mongoose document ning metodlari yoki virtuals kerak bo'lmasa, performansni yaxshilash uchun foydalidir.
      .lean()
      .exec();
    result.target = "Test";
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  // memberService objectining signup methodi, input parametri mavjud. MemberInput tipida bo'lgan inputni qabul qiladi va natijada yangi yaratilgan Member ni qaytaradi.
  public async signup(input: MemberInput): Promise<Member> {
    // bcrypt kutubxonasining genSalt methodi yordamida salt yaratish va natijani salt o'zgaruvchisiga saqlash. Salt bu parolni hash qilishda qo'shiladigan tasodifiy ma'lumot bo'lib, parolni yanada xavfsiz qilishga yordam beradi.
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);

    try {
      // memberModel ning create methodini chaqirish orqali inputni pass qilib, yangi member yaratadi va natijani result o'zgaruvchisiga saqlash. Natija Member tipida bo'ladi.
      const result = await this.memberModel.create(input);
      result.memberPassword = "";
      return result.toJSON();
    } catch (err) {
      console.log("Error, MemberService.signup:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.USED_NICK_PHONE);
    }
  }

  // memberService objectining login methodi, input parametri mavjud. LoginInput tipida bo'lgan inputni qabul qiladi va natijada Member ni qaytaradi.
  public async login(input: LoginInput): Promise<Member> {
    //TODO: consider member status

    // memberModel ning findOne methodini chaqirish orqali memberNick ga mos keladigan va memberStatusi DELETE ga teng bo'lmagan member ni topish. Natijani member o'zgaruvchisiga saqlash. Bu yerda findOne methodi ikkinchi argument sifatida { memberNick: 1, memberPassword: 1, memberStatus: 1 } ni qabul qiladi, bu esa faqat memberNick, memberPassword va memberStatus maydonlarini qaytarishni bildiradi. exec() methodi esa query ni bajaradi va natijani qaytaradi.
    const member = await this.memberModel
      .findOne(
        {
          memberNick: input.memberNick,
          memberStatus: { $ne: MemberStatus.DELETE },
        },
        { memberNick: 1, memberPassword: 1, memberStatus: 1 },
      )
      .exec();

    // Agar member topilmasa, HttpCode.NOT_FOUND va Message.NO_MEMBER_NICK bilan yangi Errors ni throw qilish. Agar memberStatusi BLOCK ga teng bo'lsa, HttpCode.FORBIDDEN va Message.BLOCKED_USER bilan yangi Errors ni throw qilish.
    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
    else if (member.memberStatus === MemberStatus.BLOCK) {
      throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER);
    }

    // bcrypt kutubxonasining compare methodini chaqirish orqali input.memberPassword ni member.memberPassword bilan solishtirish va natijani isMatch o'zgaruvchisiga saqlash. Agar parollar mos kelmasa, HttpCode.UNAUTHORIZED va Message.WRONG_PASSWORD bilan yangi Errors ni throw qilish.
    const isMatch = await bcrypt.compare(
      input.memberPassword,
      member.memberPassword,
    );

    if (!isMatch) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
    }

    return await this.memberModel.findById(member._id).lean().exec();
  }

  // memberService objectining getMemberDetail methodi, member parametri mavjud. Member tipida bo'lgan member ni qabul qiladi va natijada Member ni qaytaradi.
  public async getMemberDetail(member: Member): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const result = await this.memberModel
      .findById({ _id: memberId, memberStatus: MemberStatus.ACTIVE })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  // Define: memberService objectining updateMember methodi, member va input parametrlari mavjud. Member tipida bo'lgan member ni update qilish uchun MemberUpdateInput tipida bo'lgan input ni qabul qiladi va natijada yangilangan Member ni qaytaradi.
  public async updateMember(
    member: Member,
    input: MemberUpdateInput,
  ): Promise<Member> {
    // shapeIntoMongooseObjectId yordamida member._id ni Mongoose ObjectId formatiga o'zgartirish va memberId o'zgaruvchisiga saqlash. Bu yerda member._id aslida string formatida bo'lishi mumkin, lekin Mongoose bilan ishlash uchun uni ObjectId formatiga o'tkazish kerak.
    const memberId = shapeIntoMongooseObjectId(member._id);
    // member skima Model ning findOneAndUpdate methodini chaqirish orqali memberId ga mos keladigan member ni input bilan update qilish. {new: true} optioni update qilingan document ni qaytaradi. Natijani result o'zgaruvchisiga saqlash.
    const result = await this.memberModel
      .findOneAndUpdate({ _id: memberId }, input, { new: true })
      .exec();

    // Agar result topilmasa va error throw bolsa, return resultga borib otirmaydi va controllerdagi catch blokga otadi.
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    return result;
  }

  // memberService objectining getTopUsers methodi, top users ni olish uchun ishlatiladi va natijada Member array ni qaytaradi. Bu method memberStatusi ACTIVE ga teng bo'lgan va memberPointsi 1 yoki undan katta bo'lgan memberlarni memberPoints bo'yicha kamayish tartibida sort qiladi va faqat 4 ta natija qaytaradi.
  public async getTopUsers(): Promise<Member[]> {
    const result = await this.memberModel
      .find({
        memberStatus: MemberStatus.ACTIVE,
        memberPoints: { $gte: 1 },
      })
      .sort({ memberPoints: -1 })
      .limit(4)
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  public async addUserPoint(member: Member, point: number): Promise<Member> {
    const memberId = shapeIntoMongooseObjectId(member._id);

    return await this.memberModel
      .findOneAndUpdate(
        {
          _id: memberId,
          memberType: MemberType.USER,
          memberStatus: MemberStatus.ACTIVE,
        },
        { $inc: { memberPoints: point } },
        { new: true },
      )
      .exec();
  }

  // =========================================================
  /** SSR */

  // memberService objectining processSignup methodi, input parametri mavjud. MemberInput tipida bo'lgan inputni qabul qiladi va natijada yangi yaratilgan Member ni qaytaradi.
  public async processSignup(input: MemberInput): Promise<Member> {
    // memberModel ning findOne methodini chaqirish orqali memberTypei RESTAURANT ga teng bo'lgan member ni topish. Natijani exist o'zgaruvchisiga saqlash. Agar exist mavjud bo'lsa, HttpCode.BAD_REQUEST va Message.CREATE_FAILED bilan yangi Errors ni throw qilish. Bu yerda RESTAURANT tipidagi member faqat bitta bo'lishi mumkinligi tekshirilmoqda.
    const exist = await this.memberModel
      .findOne({ memberType: MemberType.RESTAURANT })
      .exec();
    if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);

    console.log("before:", input.memberPassword);
    const salt = await bcrypt.genSalt();
    input.memberPassword = await bcrypt.hash(input.memberPassword, salt);
    console.log("after:", input.memberPassword);

    try {
      const result = await this.memberModel.create(input);
      result.memberPassword = "";
      return result;
    } catch (err) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async processLogin(input: LoginInput): Promise<Member> {
    const member = await this.memberModel
      .findOne(
        { memberNick: input.memberNick },
        { memberNick: 1, memberPassword: 1 },
      )
      .exec();

    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);

    const isMatch = await bcrypt.compare(
      input.memberPassword,
      member.memberPassword,
    );

    if (!isMatch) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
    }

    return await this.memberModel.findById(member._id).exec();
  }

  public async getUsers(): Promise<Member[]> {
    const result = await this.memberModel
      .find({ memberType: MemberType.USER })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  // memberService objectining updateChosenUser methodi, input parametri mavjud. MemberUpdateInput tipida bo'lgan inputni qabul qiladi va natijada yangilangan Member ni qaytaradi.
  public async updateChosenUser(input: MemberUpdateInput): Promise<Member> {
    // shapeIntoMongooseObjectId yordamida input._id ni Mongoose ObjectId formatiga o'zgartirish va input._id ga saqlash. Bu yerda input._id aslida string formatida bo'lishi mumkin, lekin Mongoose bilan ishlash uchun uni ObjectId formatına o'tkazmak gerekiyor.
    input._id = shapeIntoMongooseObjectId(input._id);

    // memberModel ning findByIdAndUpdate methodini chaqirish orqali input._id ga mos keladigan member ni input bilan update qilish. {new: true, runValidators: true} optionlari update qilingan document ni qaytaradi va update jarayonida validatsiyalarni ishga tushiradi. Natijani result o'zgaruvchisiga saqlash.
    const result = await this.memberModel
      .findByIdAndUpdate({ _id: input._id }, input, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }
}

export default MemberService;
