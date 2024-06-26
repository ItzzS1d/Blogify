import mongoose from "mongoose";
import bcrypt from "bcrypt";

const htmlForgotPasswordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },

  otp: {
    type: String,
    require: true,
  },

  expires: {
    type: Date,
    default: Date.now,
    index: { expires: "5m" },
  },
});

htmlForgotPasswordSchema.pre("save", async function (next) {
  if (this.isModified("otp")) {
    this.otp = await bcrypt.hash(this.otp, 10);
  }

  next();
});

const htmlForgotPassword = mongoose.model(
  "htmlForgotPassword",
  htmlForgotPasswordSchema
);

export default htmlForgotPassword;
