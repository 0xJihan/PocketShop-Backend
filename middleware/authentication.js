const CustomError = require('../errors');
const { isTokenValid } = require('../utils');
const userModel = require('../models/User');
const jwt = require("jsonwebtoken");

const authenticateUser = async (req, res, next) => {
  let token = req.headers.authorization;

  //? checking if token is not null
  if (token) {
    //! validating token
    try {
      token = token.split(" ")[1];
      const user = await jwt.verify(token,process.env.JWT_SECRET);
      req.user = {
        email: user.email,
        userId: user.id,
        role: user.role,
      };
      next()
    } catch (err) {
     throw new CustomError.UnauthenticatedError("Unauthorized user");
    }

  } else {
    throw new CustomError.UnauthorizedError("Access denied");
  }


};

const authorizePermissions = (authorizedRoles) => {
  // when adding authorizePermissions middleware, we write it like this authorizePermissions('admin', 'owner')
  // but this call the function immediately
  // that's why we must return a function to reference to it
  return (req, res, next) => {
    if (!authorizedRoles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access this route',
      );
    }
    next();
  };
};




module.exports = { authenticateUser, authorizePermissions };
