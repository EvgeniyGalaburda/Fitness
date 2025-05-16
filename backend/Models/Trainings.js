import { model, Schema } from "mongoose";

const trainingSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    MET: {
      type: Number,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    calories: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default model("Training", trainingSchema);
