// Importing all required modules
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const RateLimit = require("express-rate-limit");
const helmet = require("helmet");
const compression = require("compression");
const { errorMiddleware } = require("./middleware/errorMiddleware");
const cors = require("cors");
require("dotenv").config();
// Import routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

// Create an express app instance
const app = express();

// Setting up rate limiter to prevent to many requests
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
});

app.use(limiter);
app.use(cors());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
);
app.use(compression());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Use Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorMiddleware);

module.exports = app;
