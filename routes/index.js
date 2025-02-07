var express = require("express");
var router = express.Router();
const { register_user, login_user } = require("../controllers/userController");
const { connectToDatabase } = require("../database/db");
const { defaultHomeAsset } = require("../middleware/cdnMiddlware");

/* GET home page. */
router.get("/", defaultHomeAsset);

router.post("/register", connectToDatabase, register_user);

router.post("/login", connectToDatabase, login_user);

module.exports = router;
