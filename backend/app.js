import express from "express";
import cookieParser from "cookie-parser";
import authRoute from "./routes/authRoute.js";
import blogRoute from "./routes/blogRoute.js";
import mongoDbConnect from "./utils/mongoDbConnect.js";
import cors from "cors";
import dotevn from "dotenv"
dotevn.config()

const app = express();
const port = 3000;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
mongoDbConnect();

app.use("/api/user", authRoute);
app.use("/api/blogs", blogRoute);

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  return res.status(status).json({ message });
});
app.listen(port, () => console.log("express server is running on port ", port));
