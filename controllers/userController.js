const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const { body } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.register_user = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill out empty fields");
  }

  // Sanitizing fields
  //   body("username")
  //     .trim()
  //     .isLength({ min: 5, max: 20 })
  //     .escape()
  //     .withMessage("Username must be specified")
  //     .isAlphanumeric()
  //     .withMessage("Username does not have alphanumeric characters");

  //   body("email").trim().escape();

  //   console.log("Made it through check two");
  //   body("password")
  //     .trim()
  //     .isLength({ min: 6, max: 20 })
  //     .escape()
  //     .withMessage("Password must be specified")
  //     .isAlphanumeric()
  //     .withMessage("Password does not have alphanumeric characters");

  const userExists = await User.findOne({ username: username });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    username: username,
    email: email,
    password: hashedPassword,
  });

  if (user) {
    res.cookie("userinfo", "");
    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
      redirectUrl: "/",
    });
  } else {
    res.status(400);
    throw new Error("Invalid User Data");
  }
});

exports.login_user = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  //   body("username")
  //     .trim()
  //     .isLength({ min: 5, max: 20 })
  //     .escape()
  //     .withMessage("Username must be specified")
  //     .isAlphanumeric()
  //     .withMessage("Username does not have alphanumeric characters");

  //   body("password")
  //     .trim()
  //     .isLength({ min: 6, max: 20 })
  //     .escape()
  //     .withMessage("Password must be specified")
  //     .isAlphanumeric()
  //     .withMessage("Password does not have alphanumeric characters");

  const user = await User.findOne({ username: username });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
      redirectUrl: "/",
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
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
