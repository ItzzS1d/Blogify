import express from "express";
import handleAsyncError from "./../utils/handleAsyncError.js";
import {
  deleteUser,
  forgotPassword,
  generateOTPAndSendToUser,
  getSingleUser,
  loginUser,
  logoutUser,
  passwordLessLogin,
  reSendOtp,
  registerUser,
  updateUserPassword,
  verifyOTP,
  verifyOTPForForgotPasswordAndUpdatePassword,
  verifyTokenForPasswordLessLogin,
 
} from "../controllers/authController.js";
import protectRoutes from "../utils/protectRoutes.js";
import { otpGenerateLimiter } from "../utils/generateOtp.js";
const router = express.Router();

router.get("/getSingleUser", protectRoutes, handleAsyncError(getSingleUser));

router.post("/register", handleAsyncError(registerUser));
router.post("/login", handleAsyncError(loginUser));
router.post("/logout", handleAsyncError(logoutUser));

router.post(
  "/update/password/:id",
  protectRoutes,
  handleAsyncError(updateUserPassword)
);
router.post(
  "/generate-otp",
  protectRoutes,
  otpGenerateLimiter,
  handleAsyncError(generateOTPAndSendToUser)
);
router.post("/verify-otp", protectRoutes, handleAsyncError(verifyOTP));
router.post(
  "/resend-otp",
  protectRoutes,
  otpGenerateLimiter,
  handleAsyncError(reSendOtp)
);
router.post(
  "/passwordless-login",
  otpGenerateLimiter,
  handleAsyncError(passwordLessLogin)
);
router.get("/", handleAsyncError(verifyTokenForPasswordLessLogin));

router.post(
  "/htmlForgot-password",
  otpGenerateLimiter,
  handleAsyncError(forgotPassword)
);
router.patch(
  "/verify-otp-htmlFor-htmlForgot-password-and-update-password",
  handleAsyncError(verifyOTPForForgotPasswordAndUpdatePassword)
);

router.delete("/:id", protectRoutes, handleAsyncError(deleteUser));

export default router;
