const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { body } = require("express-validator");
const { isValidEmail } = require("../utils/isValidEmail");
const { isValidPassword } = require("../utils/isValidPassword");

exports.register_user = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  // Checks if fields are empty. If empty then return 400 status
  if (!username || !email || !password) {
    res.status(400).json({
      errorMessage: "Please fill out empty fields",
    });
    return;
  }

  // Validate and Sanitize Fields
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .escape()
    .withMessage("Email is invalid.");
  body("username")
    .trim()
    .isLength({ max: 50 })
    .escape()
    .withMessage("Username is too long.");
  body("password")
    .trim()
    .isLength({ min: 6 })
    .escape()
    .withMessage("Password is too short.");

  // Checks if Email is valid. If not then return 401 status
  if (isValidEmail(email) === false) {
    res.status(401).json({
      errorMessage: "Invalid Email format was given. Please check your email.",
    });
    return;
  } else if (isValidPassword(password) === false) {
    res.status(401).json({
      errorMessage:
        "Invalid Password was given. Please check your inputted password.",
    });
    return;
  }
  const userExists = await User.findOne({ username: username });
  if (userExists) {
    res.status(400).json({
      errorMessage: "User already exists",
    });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username: username,
    email: email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
      redirectUrl: "/",
    });
  } else {
    res.status(400).json({
      errorMessage: "Invalid User Data",
    });
    return;
  }
});

exports.login_user = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({
      errorMessage: "Please add all fields",
    });
    return;
  }

  // Validate and Sanitize Fields
  body("username")
    .trim()
    .isLength({ max: 50 })
    .escape()
    .withMessage("Username is too long.");
  body("password")
    .trim()
    .isLength({ min: 6 })
    .escape()
    .withMessage("Password is too short.");

  const user = await User.findOne({ username: username });

  // Compare User Inputted Password with Hashed Password
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
      redirectUrl: "/",
    });
  } else {
    res.status(400).json({
      errorMessage:
        "Incorrect Credentials. Please input correct username and password.",
    });
    return;
  }
});

exports.get_user_data = asyncHandler(async (req, res, next) => {
  const { _id, username, email } = await User.findById(req.user.id);
  res.status(200).json({
    id: _id,
    username: username,
    email: email,
  });
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
