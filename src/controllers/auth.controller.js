const userModel = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/** code
 * @name resgisterUserController
 * @desc Register a new user,expecting username,email and password in the request body. Hash the password before saving to database.
 * @access Public
 */
async function registerUserController(req, res) {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Please provide username,email and password",
    });
  }

  const existingUser = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser) {
    return res.status(400).json({
      message: "Account already exists with the provided username or email",
    });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    username,
    email,
    password: hash,
  });
  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
  res.cookie("token", token);
  res.status(201).json({
    message: "User registered successfully",
    user:{
        id: user._id,
        username: user.username,
        email: user.email,
    },
    token,
  });
}
/**
 * @name loginUserController
 * @desc Login a user, expecting email and password in the request body. Verify the password and generate a JWT token.
 * @access Public
 */
async function loginUserController(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide email and password",
    });
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    },
  );
  res.cookie("token", token);
  res.status(200).json({
    message: "User logged in successfully",
    user:{
        id: user._id,
        username: user.username,
        email: user.email,
    },
    token,
  });
}
module.exports = {
  registerUserController,
  loginUserController,
};
