export const AUTH_TIMER = 1000 * 60 * 60 * 24; // 1 day
export const MORGAN_FORMAT = `:method :url :response-time [:status] \n`;


import mongoose from "mongoose";
export const shapeIntoMongooseObjectId = (target: any) => {
  return typeof target === "string"
    ? new mongoose.Types.ObjectId(target)
    : target;
};
