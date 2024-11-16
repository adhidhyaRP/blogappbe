// models/Blog.js

import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    required: true,
  },
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog
