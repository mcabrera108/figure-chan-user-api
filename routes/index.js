var express = require("express");
var router = express.Router();
const { register_user, login_user } = require("../controllers/userController");
const { connectToDatabase } = require("../database/db");

/* GET home page. */
router.get("/", (req, res) => {
  res.render("index", { title: "my figure-chan api" });
});
router.post("/register", connectToDatabase, register_user);

router.post("/login", connectToDatabase, login_user);

module.exports = router;
