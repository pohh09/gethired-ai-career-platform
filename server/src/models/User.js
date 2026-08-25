import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    lastLogoutAt: {
      type: Date,
      default: null,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    lastActiveAt: {
      type: Date,
      default: null,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1, isAdmin: 1 });
userSchema.index({ createdAt: -1 });

export default mongoose.model("User", userSchema);