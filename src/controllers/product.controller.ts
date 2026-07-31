import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import ProductService from "../models/Product.service";
import { ProductInput, ProductInquiry } from "../libs/types/product";
import { AdminRequest, ExtendedRequest } from "../libs/types/member";
import { ProductCollection } from "../libs/enums/product.enum";

const productService = new ProductService();

const productController: T = {};

/** SPA */
productController.getProducts = async (req: Request, res: Response) => {
  try {
    // query dan page, limit, order, productCollection va search ni olish. inquiry objecti ProductInquiry typeiga ega bo'ladi va getProducts methodiga uzatiladi.
    const { page, limit, order, productCollection, search } = req.query;
    const inquiry: ProductInquiry = {
      order: String(order),
      page: Number(page),
      limit: Number(limit),
    };

    // Agar productCollection query parametri mavjud bo'lsa, inquiry objectiga productCollection ni qo'shish. Agar search query parametri mavjud bo'lsa, inquiry objectiga search ni qo'shish. Bu inquiry objecti getProducts methodiga uzatiladi va unga asoslanib mahsulotlar filtrlash va qidirish amalga oshiriladi.
    if (productCollection)
      inquiry.productCollection = productCollection as ProductCollection;
    if (search) inquiry.search = String(search);

    const result = await productService.getProducts(inquiry);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getProducts", err);
    if (err instanceof Errors) res.status(err.code).json({ err });
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// getProduct methodi, req va res parametrlarini qabul qiladi. req.params.id orqali productId ni oladi va productService ning getProduct metodini chaqiradi va unga memberId (agar mavjud bo'lsa) va productId ni uzatadi. Agar ma'lumot muvaffaqiyatli olingan bo'lsa, natijani JSON formatida qaytaradi. Agar xatolik yuz bersa, xatolik xabarini qaytaradi.
productController.getProduct = async (req: ExtendedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const memberId = req.member?._id ?? null,
      result = await productService.getProduct(memberId, id);

    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getProduct", err);
    if (err instanceof Errors) res.status(err.code).json({ err });
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** SSR */

// productController objectining getAllProducts methodi, req va res parametrlarini qabul qiladi.
productController.getAllProducts = async (req: Request, res: Response) => {
  try {
    const data = await productService.getAllProducts();

    // products nomli view ni render qiladi va unga data ni uzatadi.
    res.render("products", { products: data });
  } catch (err) {
    console.log("Error, getAllProducts", err);
    if (err instanceof Errors) res.status(err.code).json({ err });
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

// productController objectining createNewProduct methodi, req va res parametrlarini qabul qiladi.
productController.createNewProduct = async (
  req: AdminRequest,
  res: Response,
) => {
  try {

    // Agar rasm yuklanmagan bo'lsa, xatolik xabarini qaytaradi.
    if (!req.files?.length)
      throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);

    // req.body dan ma'lumotlarni oladi va productImages maydonini req.files dan olingan rasm yo'llari bilan to'ldiradi.
    const data: ProductInput = req.body;
    data.productImages = req.files?.map((ele) => {
      return ele.path.replace(/\\/g, "/");
    });

    // productService ning createNewProduct metodini chaqiradi va unga data ni uzatadi.
    await productService.createNewProduct(data);
    res.send(
      `<script>alert("Product created successfully!"); window.location.replace('/admin/product/all') </script>`,
    );
  } catch (err) {
    console.log("Error, createNewProduct", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.status(HttpCode.INTERNAL_SERVER_ERROR).send(
      `<script>alert("${message}"); window.location.replace('/admin/product/all') </script>`,
    );
  }
};

// productController objectining updateChosenProduct methodi, req va res parametrlarini qabul qiladi.
productController.updateChosenProduct = async (req: Request, res: Response) => {
  try {
    // productId ni req.params.id dan oladi va productService ning updateChosenProduct metodini chaqiradi va unga productId va req.body ni uzatadi.
    const productId = req.params.id;

    const result = await productService.updateChosenProduct(
      productId,
      req.body,
    );

    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error, updateChosenProduct", err);
    if (err instanceof Errors) res.status(err.code).json({ err });
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default productController;
