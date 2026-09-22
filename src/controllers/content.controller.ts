import { Request, Response } from "express";
import { T } from "../libs/types/common";
import Errors, { HttpCode, Message } from "../libs/Errors";
import ContentService from "../models/Content.service";
import {
  TermInput,
  TermUpdateInput,
  FaqInput,
  FaqUpdateInput,
} from "../libs/types/content";

const contentService = new ContentService();

const contentController: T = {};

/** SPA — React sayti Help sahifasi shu yerdan Terms/FAQ ni o'qiydi */
contentController.getTerms = async (req: Request, res: Response) => {
  try {
    const result = await contentService.getTerms();
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getTerms", err);
    if (err instanceof Errors) res.status(err.code).json({ err });
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

contentController.getFaqs = async (req: Request, res: Response) => {
  try {
    const result = await contentService.getFaqs();
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getFaqs", err);
    if (err instanceof Errors) res.status(err.code).json({ err });
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** SSR — Admin panel content boshqaruv sahifasi */
contentController.getContentPage = async (req: Request, res: Response) => {
  try {
    const terms = await contentService.getTerms();
    const faqs = await contentService.getFaqs();
    res.render("content", { terms, faqs });
  } catch (err) {
    console.log("Error, getContentPage", err);
    res.redirect("/admin");
  }
};

contentController.createTerm = async (req: Request, res: Response) => {
  try {
    const input: TermInput = req.body;
    const result = await contentService.createTerm(input);
    res.status(HttpCode.CREATED).json({ data: result });
  } catch (err) {
    console.log("Error, createTerm", err);
    if (err instanceof Errors) res.status(err.code).json({ err });
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

contentController.updateTerm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const input: TermUpdateInput = req.body;
    const result = await contentService.updateTerm(id, input);
    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error, updateTerm", err);
    if (err instanceof Errors) res.status(err.code).json({ err });
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

contentController.deleteTerm = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await contentService.deleteTerm(id);
    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error, deleteTerm", err);
    if (err instanceof Errors) res.status(err.code).json({ err });
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

contentController.createFaq = async (req: Request, res: Response) => {
  try {
    const input: FaqInput = req.body;
    const result = await contentService.createFaq(input);
    res.status(HttpCode.CREATED).json({ data: result });
  } catch (err) {
    console.log("Error, createFaq", err);
    if (err instanceof Errors) res.status(err.code).json({ err });
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

contentController.updateFaq = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const input: FaqUpdateInput = req.body;
    const result = await contentService.updateFaq(id, input);
    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error, updateFaq", err);
    if (err instanceof Errors) res.status(err.code).json({ err });
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

contentController.deleteFaq = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await contentService.deleteFaq(id);
    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error, deleteFaq", err);
    if (err instanceof Errors) res.status(err.code).json({ err });
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default contentController;
