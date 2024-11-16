import express from 'express'
import mongoose from 'mongoose'
import Blog from '../models/blog.js';

const blogroute = express.Router()

blogroute.get('/blogs', async (req, res) => {
    try {
      const blogs = await Blog.find();
      res.json(blogs);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  // API route to get a single blog post by ID
  blogroute.get('/blogs/:id', async (req, res) => {
    try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) return res.status(404).json({ message: 'Blog not found' });
      res.json(blog);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  export default blogroute