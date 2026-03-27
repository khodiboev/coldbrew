import { HttpCode } from "../libs/Errors";
import {
  Product,
  ProductInput,
  ProductInquiry,
  ProductUpdateInput,
} from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import { Message } from "../libs/Errors";
import Errors from "../libs/Errors";
import { shapeIntoMongooseObjectId } from "../libs/config";
import { ProductStatus } from "../libs/enums/product.enum";
import { T } from "../libs/types/common";
import { ObjectId } from "mongoose";
import ViewService from "./View.service";
import { ViewInput } from "../libs/types/view";
import { ViewGroup } from "../libs/enums/view.enum";

class ProductService {
  private readonly productModel;
  public viewService;

  constructor() {
    this.productModel = ProductModel;
    this.viewService = new ViewService();
  }

  /** SPA */

  // getproducts asinxron objectini, typei product bo'gan array qaytaradi
  public async getProducts(inquiry: ProductInquiry): Promise<Product[]> {
    const match: T = { productStatus: ProductStatus.PROCESS };

    // productCollection va search query parametrlari mavjud bo'lsa, match objectiga ularni qo'shish. Bu match objecti MongoDB aggregate pipeline da $match stage uchun ishlatiladi.
    if (inquiry.productCollection)
      match.productCollection = inquiry.productCollection;

    if (inquiry.search) {
      match.productName = { $regex: new RegExp(inquiry.search, "i") };
    }

    // order query parametri bo'yicha sort qilish. Agar order "productPrice" bo'lsa, sort 1 (o'sish tartibi) bo'ladi, aks holda -1 (kamayish tartibi) bo'ladi. Bu sort objecti MongoDB aggregate pipeline da $sort stage uchun ishlatiladi.
    const sort: T =
      inquiry.order === "productPrice"
        ? { [inquiry.order]: 1 }
        : { [inquiry.order]: -1 };

    // MongoDB aggregate pipeline ni ishlatish. $match stage da match objecti, $sort stage da sort objecti, $skip stage da pagination uchun kerakli miqdorda hujjatlarni o'tkazib yuborish, $limit stage da esa kerakli miqdorda hujjatlarni olish.
    const result = await this.productModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        { $skip: (inquiry.page * 1 - 1) * inquiry.limit },
        { $limit: inquiry.limit * 1 },
      ])
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);
    return result;
  }

  // getproduct asinxron objectini, typei product bo'lgan array qaytaradi. Agar memberId mavjud bo'lsa, productni olishdan oldin view loglarini tekshirish va yangilash amalga oshiriladi.
  public async getProduct(
    memberId: ObjectId | null,
    id: string,
  ): Promise<Product> {
    const productId = shapeIntoMongooseObjectId(id);
    let result = await this.productModel
      .findOne({ _id: productId, productStatus: ProductStatus.PROCESS })
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    if (memberId) {
      // check existence
      const input: ViewInput = {
        memberId: memberId,
        viewGroup: ViewGroup.PRODUCT,
        viewRefId: productId,
      };

      const existView = await this.viewService.checkViewExicistence(input);

      console.log("existView", !!existView);
      if (!existView) {
        // insert new view log
        await this.viewService.insertMemberView(input);

        // increase counts
        result = await this.productModel
          .findByIdAndUpdate(
            productId,
            { $inc: { productViews: +1 } },
            { new: true },
          )
          .exec();
      }
    }

    return result;
  }

  /** SSR */

  // getallproducts asinxron objectini, typei product bo'gan array qaytaradi
  public async getAllProducts(): Promise<Product[]> {
    const result = await this.productModel.find().exec();
    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
  }

  // getchosenproduct asinxron objectini, typei product bo'lgan array qaytaradi
  public async createNewProduct(input: ProductInput): Promise<Product> {
    try {
      return await this.productModel.create(input);
    } catch (err) {
      console.log("Error, createNewProduct in Product.service", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  // updatechosenproduct asinxron objectini id va input parametri bor va typei product bo'lgan array qaytaradi
  public async updateChosenProduct(
    id: string,
    input: ProductUpdateInput,
  ): Promise<Product> {
    //string => ObjectId
    id = shapeIntoMongooseObjectId(id);
    const result = await this.productModel
      .findByIdAndUpdate({ _id: id }, input, { new: true })
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);

    return result;
  }
}

export default ProductService;
