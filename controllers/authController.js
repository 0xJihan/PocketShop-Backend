const User = require('../models/User');
const CustomError = require('../errors');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new CustomError.BadRequestError('Email already in use');
  }

    // Register first user as an admin
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

  const user = await User.create({ name, email, password,role});

  // const token = await createJWT({email:email,id:user._id})
  const token = jwt.sign({email:email,id:user._id,role:user.role},process.env.JWT_SECRET)


  res.status(201).json({
    message: 'Successfully registered',
    token: token
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError('Missing Email or password');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError.UnauthenticatedError('Invalid credentials');
  }

  if (!(await user.checkPassword(password))) {
    throw new CustomError.UnauthenticatedError('Invalid credentials');
  }


  const token = jwt.sign({email:email,id:user._id,role:user.role},process.env.JWT_SECRET)


  res.json({
    message: 'Successfully logged in',
    token: token
  });
};



module.exports = {
  register,
  login,
};
