import mongoose, { Schema } from "mongoose";
import { ViewGroup } from "../libs/enums/view.enum";

const ViewSchema = new Schema({
  viewGroup: { type: String, enum: ViewGroup, required: true },
  memberId: { type: Schema.Types.ObjectId, ref: "Member", required: true },

  viewRefId: { type: Schema.Types.ObjectId, required: true },
}, { timestamps: true });

export default mongoose.model("View", ViewSchema);
