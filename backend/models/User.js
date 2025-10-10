import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import bcrypt from "bcryptjs";

const nanoid = customAlphabet("1234567890", 10);

const TransactionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'Transfer', 'Airtime'
  amount: { type: Number, required: true }, // Negative for debit, positive for credit
  status: { type: String, required: true, default: "Completed" },
  description: { type: String },
  date: { type: Date, default: Date.now },
  // You could add more fields like a unique transaction ID here
});

const AutomationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["none", "daily", "weekly", "monthly"],
      default: "none",
    },
    recurringAmount: { type: Number, default: 0 },
    config: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const SavingsGoalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, required: true },
  targetAmount: { type: Number, required: true },
  targetDate: { type: Date, required: true },
  currentAmount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: false },
  automation: { type: AutomationSchema, default: () => ({}) },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // You can add a transaction history for the goal here if needed
  // history: [{
  //   date: { type: Date, default: Date.now },
  //   amount: { type: Number, required: true },
  //   type: { type: String, enum: ['deposit', 'withdrawal'], required: true }
  // }]
});

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
    transactions: [TransactionSchema],
    savingsGoals: [SavingsGoalSchema],
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

// Method to match entered PIN with hashed PIN
UserSchema.methods.matchPin = async function (enteredPin) {
  return await bcrypt.compare(enteredPin, this.pin);
};

const User = mongoose.model("User", UserSchema);

export default User;
