var express = require("express");
var router = express.Router();
const { get_user_data } = require("../controllers/userController");
const { protectUser } = require("../middleware/authMiddleware");
const { connectToDatabase } = require("../database/db");

/* GET users listing. */
router.get("/myprofile", connectToDatabase, protectUser, get_user_data);

module.exports = router;
