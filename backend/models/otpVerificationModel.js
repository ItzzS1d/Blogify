import mongoose from "mongoose";
import  bcrypt  from "bcrypt";

const otpVerificationSchema = new mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expires: {
      type: Date,
      default: Date.now,
      index: { expires: "5m" }, // Set expiration time to 1 minute
    },
  },
  { timestamps: true }
);
otpVerificationSchema.pre("save", async function (next) {
  if (this.isModified("otp")) {
    this.otp = await bcrypt.hash(this.otp, 10);
  }
  next();
});
const OtpVerification = mongoose.model(
  "OtpVerification",
  otpVerificationSchema
);
export default OtpVerification;
