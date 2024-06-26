import { rateLimit } from "express-rate-limit";


const generateOTP = () => {
  let OTP = "";
 for (let i = 0; i < 6; i++) {
    OTP += Math.floor(Math.random() * 6);
  }
  return OTP;
};

export default generateOTP;

export const otpGenerateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: "Too many requests, please try again after some time.",
  },
  headers: true, // Send rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining, etc.)
});


