import Errors, { HttpCode, Message } from "../libs/Errors";
import { AUTH_TIMER } from "../libs/config";
import { Member } from "../libs/types/member";
import jwt from "jsonwebtoken";


// AuthService classi, token yaratish va tekshirish uchun metodlarni o'z ichiga oladi.
class AuthService {
  // secretToken o'zgaruvchisi, bu token yaratishda ishlatiladi. Bu o'zgaruvchi constructor da process.env.SECRET_TOKEN dan olinadi.
  private readonly secretToken;
  constructor() {
    this.secretToken = process.env.SECRET_TOKEN as string;
  }

  // createToken methodi, payload sifatida Member tipidagi ma'lumotni qabul qiladi va token yaratadi. Bu method Promise qaytaradi, agar token yaratishda xatolik yuz bersa, reject qilinadi va agar muvaffaqiyatli bo'lsa, resolve qilinadi.
  public async createToken(payload: Member) {
    return new Promise((resolve, reject) => {
      const duration = `${AUTH_TIMER}h`;
      jwt.sign(
        payload,
        process.env.SECRET_TOKEN as string,
        { expiresIn: duration },
        (err: any, token: unknown) => {
          if (err)
            reject(
              new Errors(HttpCode.UNAUTHORIZED, Message.TOKEN_CREATION_FAILED),
            );
          else resolve(token as string);
        },
      );
    });
  }

  public async checkAuth(token: string): Promise<Member> {
    const result: Member = (await jwt.verify(
      token,
      this.secretToken,
    )) as Member;
    console.log(`---[AUTH] memberNick: ${result.memberNick}---`);
    return result;
  }
}

export default AuthService;
