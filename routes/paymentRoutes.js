import express from 'express';
import Razorpay from 'razorpay';
import PaymentBlog from '../models/paymentBlogModel.js'; // Import the Payment model
import User from '../models/usermodel.js'; // Import User model
import Course from '../models/courseModel.js'; // Import Course model
import dotenv from 'dotenv';

dotenv.config();

const paymentrouter = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create an order
paymentrouter.post('/order', async (req, res) => {
    const { amount, currency, courseId, userId } = req.body;
    try {
        // Verify that courseId and userId are valid
        const course = await Course.findById(courseId);
        const user = await User.findById(userId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const options = {
            amount: amount * 100, // amount in smallest currency unit
            currency,
        };

        const order = await razorpay.orders.create(options);

        // Save the payment details with status 'created'
        const payment = new PaymentBlog({
            userId,
            courseId,
            orderId: order.id,
            amount,
            currency,
            status: 'created',
        });

        await payment.save();

        res.json(order);
    } catch (error) {
        console.error('Order creation failed:', error.message);
        res.status(500).json({ message: 'Order creation failed', error: error.message });
    }
});
// Handle payment success
paymentrouter.post('/success', async (req, res) => {
    const { order_id, payment_id } = req.body;

    try {
        const payment = await PaymentBlog.findOneAndUpdate(
            { orderId: order_id },
            { paymentId: payment_id, status: 'successful' },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        const user = await User.findById(payment.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.courses) {
            user.courses = [];
        }

        if (!user.courses.includes(payment.courseId)) {
            user.courses.push(payment.courseId);
            await user.save();
        }

        res.json({ message: 'Payment successful, course added to your list.' });
    } catch (error) {
        res.status(500).json({ message: 'Payment success handling failed', error: error.message });
    }
});

export default paymentrouter;
