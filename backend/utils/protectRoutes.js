import jwt from "jsonwebtoken";
import User from "../models/authModel.js";

const protectRoutes = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token)
    return res.status(401).json({ error: "please log in to continue" });
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) return res.status(401).json({ error: "Unauthorized" });
    req.user = decodedToken;
    next();
  });
};

export const passwordLessLoginVerifyUser = async (req, res) => {
  const { token } = req.query;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedToken) return res.status(401).json({ error: "Unauthorized" });
  const user = await User.findOne({ id: decodedToken.id });
  if (!user) return res.status(401).json({ error: "Unauthorized" });
  const { password, ...userInfo } = user._doc;
  return res.status(200).json(userInfo);
};

export default protectRoutes;
