import express from 'express';
import Course from '../models/courseModel.js'

const courserouter = express.Router();

// Get all courses
// Get all courses
courserouter.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a specific course by ID
courserouter.get('/courses/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
export default courserouter;
