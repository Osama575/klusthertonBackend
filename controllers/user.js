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
  
    
      
    res.status(StatusCodes.OK).json({
      userData:user,
    });
  };
  
  
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
        });

        // Extract relevant data from users, including only the relevant group
        const userData = users.map(user => {
            const userObject = user.toObject({ flattenMaps: true }); // Convert Map to Object

            // Filter the chat groups to include only the relevant group
            userObject.chat.groups = userObject.chat.groups.filter(group => group.courseId.toString() === courseId);

            // Convert scoringResult Map to Object if necessary
            if (userObject.scoringResult instanceof Map) {
                userObject.scoringResult = Object.fromEntries(userObject.scoringResult);
            }

            return userObject;
        });

        res.status(200).json(userData);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
}


const getCourseGroup = async (req, res) => {
    try {
        const courseId = req.body
        const {userId} = req.params
       

        // Find the specific user and check their chat groups for the given course
        const user = await User.findOne({
            _id: userId,
            'chat.groups.courseId': courseId
        }, { 'chat.groups.$': 1 }); // Select only the matching group

        if (!user || !user.chat || !user.chat.groups || user.chat.groups.length === 0) {
            return res.status(404).json({ message: 'Group not found for the specified course' });
        }

        // Extract the groupId from the matched group
        const groupId = user.chat.groups[0].groupId;

        res.status(200).json({ groupId });
    } catch (error) {
        console.error('Error fetching user group:', error);
        res.status(500).json({ message: 'Error fetching user group', error: error.message });
    }
};



const usersArray = async (req, res) => {
    const { userIds } = req.body; // Expecting an array of user IDs in the request body

    // Validate the userIds input
    if (!userIds || !Array.isArray(userIds)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid input: userIds must be an array' });
    }

    try {
        const users = await User.find({ _id: { $in: userIds } });

        const userDatas = users.map(user => extractUserData2(user));
        
        res.status(StatusCodes.OK).json(userDatas);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching users', error: error.message });
    }
};

const extractUserData2 = (user) => {
    let userData = user.toObject({ flattenMaps: true }); // Convert the user document to an object

    // Exclude the "password" field and any undefined values
    userData = Object.fromEntries(
        Object.entries(userData)
            .filter(([key]) => key !== "password" && userData[key] !== undefined)
    );

    // Convert Map to Object if scoringResult is a Map
    if (userData.scoringResult instanceof Map) {
        userData.scoringResult = Object.fromEntries(userData.scoringResult);
    }

    return userData;
};



  module.exports = {editUser, getUser, getUserByGroupCourse, usersArray, getCourseGroup, getCourseGroup}