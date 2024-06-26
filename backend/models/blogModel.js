
import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
//   comments: [{
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//     text: {
//       type: String,
//       required: true,
    
//     },
//   }],
//   likes: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   ],
    image: {
        type: String,
        required: true,
    },
},{timestamps: true});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;