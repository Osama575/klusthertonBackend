const Course = require('../models/Course'); // path to Course model
const User = require('../models/User'); // path to User model

const createNewCourse = async (req, res) => {
    try {
        const courseData = req.body; // The course data is sent in the request body
        const course = new Course(courseData);
        await course.save();
        res.status(201).json({ message: 'New course created successfully', course });
    } catch (error) {
        console.error('Error creating new course:', error);
        res.status(500).json({ message: 'Error creating new course', error: error.message });
    }
};

const getSingleCourse = async (req, res) => {
    try {
        const courseId = req.params.id; // The course ID is passed as a URL parameter
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json(course);
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ message: 'Error fetching course', error: error.message });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({}).select('name tutor duration registeredStudents _id');
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
};


const joinCourse = async (req, res) => {
    try {
        const userId = req.user.userid; // Assuming the user ID is available in req.user
        const courseId = req.body.courseId; // The course ID to join

        console.log(userId)

        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        // Check if the user is already registered for the course
        const userAlreadyRegistered = await User.findOne({ _id: userId, 'courseInfo.courses': courseId });
        if (userAlreadyRegistered) {
            return res.status(202).json({ message: "User is already registered for this course" });
        }

        // Add the course ID to the user's courses
        const updateResult = await User.updateOne(
            { _id: userId },
            { $addToSet: { 'courseInfo.courses': courseId } } // Use $addToSet to prevent duplicates
        );

        if (updateResult.nModified === 0) {
            throw new Error('Unable to join course');
        }

        res.status(200).json({ message: 'Successfully joined the course' });
    } catch (error) {
        console.error('Error joining course:', error);
        res.status(500).json({ message: 'Error joining course', error: error.message });
    }
};



module.exports = {
    createNewCourse,
    getAllCourses,
    getSingleCourse,
    joinCourse
}