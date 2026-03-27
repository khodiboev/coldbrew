import Errors, { HttpCode, Message } from "../libs/Errors";
import { View, ViewInput } from "../libs/types/view";
import ViewModel from "../schema/View.model";

// ViewService classi, viewModel ni private property sifatida oladi va view bilan bog'liq operatsiyalarni bajaradi.
class ViewService {
  private readonly viewModel;

  constructor() {
    this.viewModel = ViewModel;
  }

  // checkViewExicistence metodi, view logining mavjudligini tekshiradi. Agar memberId va viewRefId ga mos keladigan view logi mavjud bo'lsa, uni qaytaradi, aks holda null qaytaradi.
  public async checkViewExicistence(input: ViewInput): Promise<View> {
    return await this.viewModel
      .findOne({ memberId: input.memberId, viewRefId: input.viewRefId })
      .exec();
  }

  // insertMemberView metodi, yangi view logini yaratadi. Agar view logi muvaffaqiyatli yaratilsa, uni qaytaradi, aks holda xatolik tashlaydi.
  public async insertMemberView(input: ViewInput): Promise<View> {
    try {
      return await this.viewModel.create(input);
    } catch (err) {
      console.log("Error, insertMemberView", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
}

export default ViewService;
