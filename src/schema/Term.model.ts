import mongoose, { Schema } from "mongoose";

const termSchema = new Schema(
  {
    termText: {
      type: String,
      required: true,
    },

    termOrder: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true },
); //updatedAt, createdAt

export default mongoose.model("Term", termSchema);
