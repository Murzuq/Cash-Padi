import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import bcrypt from "bcryptjs";

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
    pin: {
      type: String,
      required: [true, "Please set a transaction PIN"],
      select: false,
    },
  },
  { timestamps: true }
);

// Encrypt password using bcrypt before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Encrypt PIN using bcrypt before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("pin")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.pin = await bcrypt.hash(this.pin, salt);
  next();
});

// Method to compare entered password with hashed password
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to compare entered PIN with hashed PIN
UserSchema.methods.comparePin = async function (enteredPin) {
  return await bcrypt.compare(enteredPin, this.pin);
};

const User = mongoose.model("User", UserSchema);

export default User;
