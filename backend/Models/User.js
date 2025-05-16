import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    weight: {
      type: Number,
      required: false,
    },
    height: {
      type: Number,
      required: false,
    },

    age: {
      type: Number,
    },

    sex: {
      type: String,
    },

    imt: {
      type: Number,
      required: false,
    },
    calorieGoal: {
      type: Number,
    },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    friendRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
