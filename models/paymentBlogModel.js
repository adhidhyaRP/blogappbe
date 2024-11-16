import mongoose from 'mongoose';

const paymentBlogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    orderId: { type: String, required: true },
    paymentId: { type: String }, // Not required during order creation
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: { type: String, enum: ['created', 'successful', 'failed'], default: 'created' },
}, { timestamps: true });

const PaymentBlog = mongoose.model('PaymentBlog', paymentBlogSchema);

export default PaymentBlog;

