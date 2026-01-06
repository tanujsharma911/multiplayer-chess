import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Anonymous",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
    },
    rating: {
      type: Number,
      default: 600,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      userId: this._id.toString(),
      email: this.email,
      avatar: this.avatar,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY! as StringValue,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      userId: this._id.toString(),
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY! as StringValue,
    }
  );
};
interface UserMethods {
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export type UserModel = mongoose.Model<
  mongoose.InferSchemaType<typeof userSchema>
> &
  UserMethods;

export const User = mongoose.model("User", userSchema) as unknown as UserModel;
