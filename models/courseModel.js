import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
    image: String,
    title: String,
    price: Number,
    introduction: String,
    toolsCovered: [String],
    programOverview: String
});

const Course = mongoose.model('Course', courseSchema);
export default Course;
