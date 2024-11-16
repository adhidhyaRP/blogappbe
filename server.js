import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import authrouter from './routes/auth.js';
import blogroute from './routes/blogroute.js';
import courserouter from './routes/courseRoutes.js';
import paymentrouter from './routes/paymentRoutes.js';
import myCoursesRouter from './routes/mycousesrouter.js';

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();
app.use('/api/payment', paymentrouter);
app.use('/api',myCoursesRouter)
app.use('/api',blogroute)
app.use('/api',courserouter)
app.use('/auth', authrouter);

const PORT = process.env.PORT || 3000;
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export { app, transporter };
