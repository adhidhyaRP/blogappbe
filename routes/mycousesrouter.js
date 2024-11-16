import express from 'express';
import PaymentBlog from '../models/paymentBlogModel.js';
import Course from '../models/courseModel.js';

const myCoursesRouter = express.Router();

// Fetch user's purchased courses
myCoursesRouter.get('/mycourses/:userId', async (req, res) => {
  try {
    const payments = await PaymentBlog.find({ userId: req.params.userId, status: 'successful' }).populate('courseId');
    console.log(payments)
    if (!payments.length) {
      return res.status(404).json({ message: 'No purchased courses found' });
    }

    const courses = payments.map(payment => ({
      _id: payment.courseId._id,
      image: payment.courseId.image,
      title: payment.courseId.title,
      description: payment.courseId.introduction, // Assuming 'description' refers to 'introduction'
    }));

    res.json(courses);
    // console.log(courses)
  } catch (error) {
    // console.log(courses)
    res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
  }
});

export default myCoursesRouter;
