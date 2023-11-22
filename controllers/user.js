const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')


const editUser = async (req, res) => {
    try {
      const {
        params: { id: userid },
        body: changes, // Destructure the changes directly from the req.body
      } = req;
  
      const result = await User.updateOne(
        { _id: userid },
        { $set: changes }, // Use $set to update the specified fields
        { runValidators: true }
      );
  
      if (result.nModified === 0) {
        throw new NotFoundError("Error making changes");
      }
  
      res.status(StatusCodes.OK).json({ msg: "Change has been successfully made" });
    } catch (error) {
      res.status(StatusCodes.BAD_REQUEST).json({ msg: error.message });
    }
  };

  module.exports = {editUser}