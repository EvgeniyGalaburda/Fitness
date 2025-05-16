import { model, Schema } from "mongoose";

const foodSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    energyValue: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    calories: {
      type: Number,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Food", foodSchema);
