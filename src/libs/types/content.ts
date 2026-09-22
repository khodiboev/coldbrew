import { ObjectId } from "mongoose";

/** TERM (Terms & Conditions) */
export interface Term {
  _id: ObjectId;
  termText: string;
  termOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TermInput {
  termText: string;
  termOrder?: number;
}

export interface TermUpdateInput {
  termText?: string;
  termOrder?: number;
}

/** FAQ */
export interface Faq {
  _id: ObjectId;
  faqQuestion: string;
  faqAnswer: string;
  faqOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FaqInput {
  faqQuestion: string;
  faqAnswer: string;
  faqOrder?: number;
}

export interface FaqUpdateInput {
  faqQuestion?: string;
  faqAnswer?: string;
  faqOrder?: number;
}
