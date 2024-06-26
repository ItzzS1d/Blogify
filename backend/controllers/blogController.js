import { isValidObjectId } from "mongoose";
import Blog from "./../models/blogModel.js";

export const createBlog = async (req, res) => {
  const { title, summary, content, image } = req.body;
  const blog = await Blog.findOne({ title });
  if (blog) return res.status(400).json({ error: "Blog already exist" });
  const newBlog = await Blog.create({
    title,
    summary,
    content,
    author: req.user.id,
    image,
  });
  return res.status(201).json(newBlog);
};

export const getBlogs = async (req, res) => {
  const blogs = await Blog.find().sort({ createdAt: -1 }).populate("author");
  return res.status(200).json(blogs);
};

export const getBlogById = async (req, res) => {
  if (!isValidObjectId(req.params.id))
    return res.status(400).json({ error: "Invalid blog id" });
  const blog = await Blog.findById(req.params.id).populate({
    path: "author",
    select: "-password",
  });
  if (!blog) return res.status(404).json({ error: "Blog not found" });
  return res.status(200).json(blog);
};

export const updateBlog = async (req, res) => {
  const { title, summary, content, image } = req.body;
  if (!isValidObjectId(req.params.id))
    return res.status(400).json({ error: "Invalid blog id" });
  const isBlogExist = await Blog.findById(req.params.id);
  if (!isBlogExist) return res.status(404).json({ error: "Blog not found" });
  if (isBlogExist.author.toString() !== req.user.id.toString())
    return res
      .status(401)
      .json({ error: "You are not authorized to update this blog" });
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    {
      title,
      summary,
      content,
      image,
    },
    { new: true }
  );

  return res.status(200).json(blog);
};

export const deleteBlog = async (req, res) => {
  const isBlogExist = await Blog.findById(req.params.id);
  if (!isBlogExist) return res.status(404).json({ error: "Blog not found" });
  if (isBlogExist.author.toString() !== req.user.id.toString())
    return res
      .status(401)
      .json({ error: "You are not authorized to delete this blog" });
  await Blog.findByIdAndDelete(req.params.id);
  return res.status(200).json({ message: "blog deleted successfully" });
};

export const blogByAuthor = async (req, res) => {
  const blogs = await Blog.find({ author: req.user.id });
  return res.status(200).json(blogs);
};
