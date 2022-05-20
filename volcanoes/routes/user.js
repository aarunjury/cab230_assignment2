var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("index", { title: "User Endpoint" });
});

router.get("/register", function (req, res, next) {
  res.render("index", { title: "Register Endpoint" });
});

router.get("/login", function (req, res, next) {
  res.render("index", { title: "Login Endpoint" });
});

module.exports = router;
