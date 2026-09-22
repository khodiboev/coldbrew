import mongoose, { Schema } from "mongoose";

const faqSchema = new Schema(
  {
    faqQuestion: {
      type: String,
      required: true,
    },

    faqAnswer: {
      type: String,
      required: true,
    },

    faqOrder: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true },
); //updatedAt, createdAt

export default mongoose.model("Faq", faqSchema);
