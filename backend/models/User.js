import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890", 10);

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please provide your full name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
      select: false, // Don't send password back in responses
    },
    accountNumber: {
      type: String,
      default: () => nanoid(),
      unique: true,
    },
    balance: {
      type: Number,
      default: 50000, // Default starting balance for new users
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
