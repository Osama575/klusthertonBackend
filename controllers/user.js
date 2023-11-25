const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')

const mongoose = require('mongoose');

const editUser = async (req, res) => {
  try {
      const { id: userId } = req.params;
      const changes = req.body; // Contains changes for different nested schemas

      const userExists = await User.exists({ _id: userId });
if (!userExists) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
}

      let update = {};
      for (let key in changes) {
          if (changes.hasOwnProperty(key)) {
              for (let nestedKey in changes[key]) {
                  if (changes[key].hasOwnProperty(nestedKey)) {
                      update[`${key}.${nestedKey}`] = changes[key][nestedKey];
                  }
              }
          }
      }

      const result = await User.updateOne(
          { _id: userId },
          { $set: update },
          { runValidators: true }
      );

      if (result.nModified === 0) {
          throw new Error("Error making changes");
      }

      res.status(StatusCodes.OK).json({ msg: "Change has been successfully made" });
  } catch (error) {
      console.log(error);
      res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message });
  }
};


  const getUser = async (req, res) => {
    const {
      params: { id: userId },
    } = req;
  
    const user = await User.findOne({ _id: userId });
  
    const userData = extractUserData(user);
      
    res.status(StatusCodes.OK).json({
      userData,
    });
  };
  
  const extractUserData = (user) => {
    const userData = Object.fromEntries(
      Object.entries(user.toObject())
        .filter(([key]) => key !== "password") // Exclude the "password" field
        .filter(([key, value]) => value !== undefined)
    );
    
    return userData;
  }


// Route to get users by course ID
const getUserByGroupCourse = async (req, res) => {
    try {
        const courseId = req.body.courseId;

        // Validate if courseId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: 'Invalid courseId' });
        }

        // Find users who are in the chat group for the given course
        const users = await User.find({
            'chat.groups': { $elemMatch: { courseId: mongoose.Types.ObjectId(courseId) } }
        }).select('_id IqScore personality levelOfEducation age gender chat'); // Modify the selected fields as needed

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message }
    )}
  
}


  module.exports = {editUser, getUser, getUserByGroupCourse}