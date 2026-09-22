import { HttpCode, Message } from "../libs/Errors";
import Errors from "../libs/Errors";
import { shapeIntoMongooseObjectId } from "../libs/config";
import TermModel from "../schema/Term.model";
import FaqModel from "../schema/Faq.model";
import {
  Term,
  TermInput,
  TermUpdateInput,
  Faq,
  FaqInput,
  FaqUpdateInput,
} from "../libs/types/content";

// Help sahifasidagi (Terms & Conditions, FAQ) statik matnlarni admin panel orqali
// boshqarish (CRUD) uchun mas'ul servis.
class ContentService {
  private readonly termModel;
  private readonly faqModel;

  constructor() {
    this.termModel = TermModel;
    this.faqModel = FaqModel;
  }

  /** TERMS */

  public async getTerms(): Promise<Term[]> {
    const result = await this.termModel.find().sort({ termOrder: 1 }).exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  public async createTerm(input: TermInput): Promise<Term> {
    try {
      if (input.termOrder === undefined) {
        input.termOrder = (await this.termModel.countDocuments().exec()) + 1;
      }
      return await this.termModel.create(input);
    } catch (err) {
      console.log("Error, createTerm in Content.service", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async updateTerm(id: string, input: TermUpdateInput): Promise<Term> {
    const termId = shapeIntoMongooseObjectId(id);
    const result = await this.termModel
      .findByIdAndUpdate(termId, input, { new: true })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }

  public async deleteTerm(id: string): Promise<Term> {
    const termId = shapeIntoMongooseObjectId(id);
    const result = await this.termModel.findByIdAndDelete(termId).exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }

  /** FAQ */

  public async getFaqs(): Promise<Faq[]> {
    const result = await this.faqModel.find().sort({ faqOrder: 1 }).exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  public async createFaq(input: FaqInput): Promise<Faq> {
    try {
      if (input.faqOrder === undefined) {
        input.faqOrder = (await this.faqModel.countDocuments().exec()) + 1;
      }
      return await this.faqModel.create(input);
    } catch (err) {
      console.log("Error, createFaq in Content.service", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async updateFaq(id: string, input: FaqUpdateInput): Promise<Faq> {
    const faqId = shapeIntoMongooseObjectId(id);
    const result = await this.faqModel
      .findByIdAndUpdate(faqId, input, { new: true })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }

  public async deleteFaq(id: string): Promise<Faq> {
    const faqId = shapeIntoMongooseObjectId(id);
    const result = await this.faqModel.findByIdAndDelete(faqId).exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result;
  }
}

export default ContentService;
