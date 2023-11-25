const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')

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
  
  const getUsersArray = async (req, res) => {
      const { userIds } = req.body; // Expecting an array of user IDs in the request body
  
      // Validate the userIds input
      if (!userIds || !Array.isArray(userIds)) {
          return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid input: userIds must be an array' });
      }
  
      try {
          const users = await User.find({ _id: { $in: userIds } }).select('IqScore personality levelOfEducation age gender course module');
  
          const userDatas = users.map(user => extractUserData2(user));
          
          res.status(StatusCodes.OK).json(userDatas);
      } catch (error) {
          console.error('Error fetching users:', error);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching users', error: error.message });
      }
  };
  
  const extractUserData2 = (user) => {
      const userData = Object.fromEntries(
          Object.entries(user.toObject())
              .filter(([key]) => key !== "password") // Exclude the "password" field
              .filter(([key, value]) => value !== undefined)
      );
      
      return userData;
  };
  
 


  module.exports = {editUser, getUser, getUsersArray}