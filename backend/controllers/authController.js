import User from "../models/authModel.js";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import bcrypt from "bcrypt";
import { sendMail } from "../utils/sendEmail.js";
import OtpVerification from "../models/otpVerificationModel.js";
import generateOTP from "../utils/generateOtp.js";
import { isValidObjectId } from "mongoose";
import jwt from "jsonwebtoken";
import ForgotPassword from "../models/ForgotPasswordModel.js";


export const getSingleUser = async (req, res) => {
  const { id } = req.body;
  if (!isValidObjectId(id))
    return res.status(400).json({ error: "Invalid user id" });
  const user = await User.findById(id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const { password: dbPassword,...userInfo } = user._doc;
  return res.status(200).json(userInfo);
}

export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  // Check if first name and last name are the same
  if (firstName === lastName)
    return res
      .status(400)
      .json({ error: "First name and last name cannot be the same" });

  // Check if user with the same email already exists
  const isUserExist = await User.findOne({ email });
  if (isUserExist)
    return res.status(400).json({ error: "User already exists" });

  // Create a new user
  const newUser = await User.create({ firstName, lastName, email, password });

  // Generate OTP and save it for verification
  // const OTP = generateOTP();
  // await OtpVerification.create({ otp: OTP, userId: newUser.id });

  // Send verification email
  // const subject = "verification email";
  // const text = OTP;
  // sendMail(email, subject, text);
  // res.status(201).json({ message: "otp has been sent to your email address" });

  // Set HTTP-only cookie with JWT token for authentication
  generateTokenAndSetCookie(newUser.id, res);
  const { password: dbPassword, ...user } = newUser._doc;
  return res.status(201).json(user);
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email ||!password) return res.status(400).json({ error: "Please enter both email and password" });
  const isUserExist = await User.findOne({ email });
  if (!isUserExist)
    return res.status(400).json({ error: "Invalid email or password" });
  const isMatch = await bcrypt.compare(password, isUserExist.password);
  if (!isMatch)
    return res.status(400).json({ error: "Invalid email or password" });
  generateTokenAndSetCookie(isUserExist.id, res);
  const { password: dbPassword, ...user } = isUserExist._doc;
  return res.status(200).json(user);
};

export const logoutUser = (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(400).json({ error: "No token found" });
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully" });
};

export const deleteUser = async (req, res) => {
  const { password } = req.body;
  if (req.user?.id !== req.params.id)
    return res.status(401).json({ error: "Unauthorized" });
  if (!password)
    return res
      .status(400)
      .json({ error: "Please enter your password to delete your account" });
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid password" });
  await User.findByIdAndDelete(req.params.id);
  return res.status(200).json({ message: "User deleted successfully" });
};

export const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    return res.status(400).json({ error: "Please enter old and new password" });
  if (req.user?.id !== req.params.id)
    return res.status(401).json({ error: "Unauthorized" });
  if (oldPassword === newPassword)
    return res
      .status(400)
      .json({ error: "Old and new password cannot be the same" });
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid old password" });
  user.password = newPassword;
  await user.save();
  return res.status(200).json({ message: "Password updated successfully" });
};
export const generateOTPAndSendToUser = async (req, res) => {
  const { email } = req.body;
  //check if email is provided
  if (!email)
    return res.status(400).json({ error: "Please enter your email address" });

  //check if user exist
  const isUserExist = await User.findOne({ email });
  if (!isUserExist)
    return res.status(400).json({ error: "Invalid email address" });

  //check if user already verified
  if (isUserExist.isVerified)
    return res.status(400).json({ error: "Email already verified" });

  //check if otp already sent
  const isOtpExist = await OtpVerification.findOne({ userId: isUserExist.id });
  if (isOtpExist)
    return res
      .status(400)
      .json({ error: "OTP already sent, please check your email" });

  //generate OTP and save it in database
  const OTP = generateOTP();
  await OtpVerification.create({ otp: OTP, userId: isUserExist.id });
  const subject = "verification email";
  const html = `
            <h1>Blogify</h1>
            <p>
Enter the code below to securely log in. This code will expire in 5 minutes.</p>
            <h1><strong>${OTP}</strong></h1>
        `;

  //send mail to user
  sendMail(email, subject, html);
  res.status(201).json({ message: "otp has been sent to your email address" });
};

export const verifyOTP = async (req, res) => {
  const { userId, otp } = req.body;
  // check if otp is provided
  if (!otp || !userId)
    return res.status(400).json({ error: "Please enter both OTP and userId" });

  // Check if userId is a valid ObjectId
  if (!isValidObjectId(userId))
    return res.status(400).json({ error: "Invalid user id" });

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  // Check if the user making the request is the same as the user being verified
  if (req.user?.id !== user.id)
    return res.status(401).json({ error: "Unauthorized" });

  // check if otp exist in database
  const isOtpExist = await OtpVerification.findOne({ userId: req.user?.id });
  if (!isOtpExist)
    return res
      .status(400)
      .json({ error: "please generate otp to verify your email" });

  // Compare the provided OTP with the stored hashed OTP
  const isCorrectOtp = await bcrypt.compare(otp, isOtpExist.otp);
  if (!isCorrectOtp) return res.status(400).json({ error: "Invalid OTP" });

  // Mark the user as verified
  user.isVerified = true;
  await user.save();

  // Delete the OTP record from the database
  await OtpVerification.findByIdAndDelete(isOtpExist.id);
  return res.status(200).json({ message: "Email verified successfully" });
};

export const reSendOtp = async (req, res) => {
  const { email } = req.body;
  //check if email is provided
  if (!email)
    return res.status(400).json({ error: "Please enter your email address" });

  //check if user exist
  const isUserExist = await User.findOne({ email });
  if (!isUserExist)
    return res.status(400).json({ error: "Invalid email address" });

  //check if user already verified
  if (isUserExist.isVerified)
    return res.status(400).json({ error: "Email already verified" });

  //check if otp already sent if delete it
  const isOtpExist = await OtpVerification.findOne({ userId: isUserExist.id });
  if (isOtpExist) {
    await OtpVerification.findByIdAndDelete(isOtpExist.id);
  }

  //generate OTP and save it in database
  const OTP = generateOTP();
  await OtpVerification.create({ otp: OTP, userId: isUserExist.id });
  const subject = "verification email";
  const html = `
            <h1>Blogify</h1>
            <p>
Enter the code below to securely log in. This code will expire in 5 minutes.</p>
            <h1><strong>${OTP}</strong></h1>
        `;

  //send mail to user
  sendMail(email, subject, html);
  return res
    .status(201)
    .json({ message: "otp has been sent to your email address" });
};

export const passwordLessLogin = async (req, res) => {
  const { email } = req.body;
  //check if email is provided
  if (!email)
    return res.status(400).json({ error: "Please enter your email address" });
  //check if user exist
  const isUserExist = await User.findOne({ email });
  if (!isUserExist)
    return res.status(400).json({ error: "Invalid email address" });

  const token = jwt.sign({ id: isUserExist.id }, "process.env.JWT_SECRET", {
    expiresIn: "5m",
  });

  sendMail(
    email,
    "PasswordLess Login.",
    `<h1>Please Note that this link is Valid for only <strong>1 minute.</strong></h1>
    <p>click on the link to login without password <a href="http://localhost:3000/api/user?token=${token}">click here</a> to login</p>
    `
  );
  return res
    .status(200)
    .json({ message: "please check your email address to login" });
};

export const verifyTokenForPasswordLessLogin = async (req, res) => {
  const { token } = req.query;
  const isValidToken = jwt.verify(
    token,
    "process.env.JWT_SECRET",
    (err, decoded) => {
      if (err) return res.status(401).send("<h1>Invalid Token or Expired</h1>");
      return decoded;
    }
  );

  const user = await User.findById(isValidToken.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  generateTokenAndSetCookie(user.id, res);
  return res.status(200).json(user);
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  //check if email is provided
  if (!email)
    return res.status(400).json({ error: "Please enter your email address" });
  //check if user exist
  const isUserExist = await User.findOne({ email });
  if (!isUserExist)
    return res.status(400).json({ error: "Email not found" });
  const OTP = generateOTP();
  await ForgotPassword.create({ userId: isUserExist.id, otp: OTP });
  const subject = "verification email email for forgot password";
  const html = `
            <h1>Blogify</h1>
            <p>Enter the code below to reset your password. This code will expire in 5 minutes.</p>
            <h1><strong>${OTP}</strong></h1>`;
  sendMail(email, subject, html);
  return res
    .status(201)
    .json({ message: "otp has been sent to your email address" });
};
export const verifyOTPForForgotPasswordAndUpdatePassword = async (req, res) => {
  const { userId, otp, newPassword, confirmNewPassword } = req.body;

  // check if otp is provided
  if (!otp || !userId || !newPassword || !confirmNewPassword)
    return res.status(400).json({ error: "Please enter all fields" });

  // Check if userId is a valid ObjectId
  if (!isValidObjectId(userId))
    return res.status(400).json({ error: "Invalid user id" });

  // Find the user by ID
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  const OTP = await ForgotPassword.findOne({ userId });
  if (!OTP)
    return res
      .status(400)
      .json({ error: "Invalid  otp or otp is not generated" });

  // Compare the provided OTP with the stored hashed OTP
  const isCorrectOtp = await bcrypt.compare(otp, OTP.otp);
  if (!isCorrectOtp) return res.status(400).json({ error: "Invalid OTP" });

 
  // Update the user's password

  //check if newPassword and confirmNewPassword is same
  if (newPassword !== confirmNewPassword)
    return res
      .status(400)
      .json({ error: "new password and confirm new password is not same" });

  const updatePassword = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(userId, { password: updatePassword });
  await ForgotPassword.findByIdAndDelete(OTP.id);
  return res.status(200).json({ message: "password updated successfully" });
};


