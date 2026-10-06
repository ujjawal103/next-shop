import mongoose, { Schema, Model } from "mongoose";

export type UserDocument = {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
};

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<UserDocument> =
  mongoose.models.User ||
  mongoose.model<UserDocument>("User", userSchema);

export default User;