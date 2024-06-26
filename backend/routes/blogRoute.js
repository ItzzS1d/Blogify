import express from "express";
import {
  blogByAuthor,
  createBlog,
  deleteBlog,
  getBlogById,
  getBlogs,
  updateBlog,
} from "../controllers/blogController.js";
import protectRoutes from "../utils/protectRoutes.js";
import handleAsyncError from "../utils/handleAsyncError.js";
const router = express.Router();

router.get("/", handleAsyncError(getBlogs));
router.get("/blogs-by-author",protectRoutes , handleAsyncError(blogByAuthor));
router.get("/:id", handleAsyncError(getBlogById));
router.post("/create", protectRoutes, handleAsyncError(createBlog));
router.patch("/update/:id", protectRoutes, handleAsyncError(updateBlog));
router.delete("/delete/:id", protectRoutes, handleAsyncError(deleteBlog));

export default router;
