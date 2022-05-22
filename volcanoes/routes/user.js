const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post("/register", function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const checkUser = req.db.from("users").select("*").where("email",email)
  if (!email || !password){
    res.status(400).json({
      "error": true,
      "message": "Request body incomplete, both email and password are required"
    })
    return;
  }
  checkUser.then((users) => {
    if (users.length > 0){
      res.status(409).json({
        "error": true,
        "message": "User already exists"
      })
      return;
    }
  })
  return req.db.from("users").insert({email, password})
  .then(() =>{
    res.status(201).json({
      "message": "User created"
    })
  })
  .catch((err) => {
    console.log(err);
  });
});

router.post("/login", function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const checkUser = req.db.from("users").select("*").where("email",email)
  if (!email || !password){
    res.status(400).json({
      "error": true,
      "message": "Request body incomplete, both email and password are required"
    })
    return;
  }
  checkUser.then((users) => {
    if (users.length == 0){
      res.status(401).json({
        "error": true,
        "message": "Incorrect email or password"
      })
      console.log("User not found in table");
      return;
    }
    const user = users[0];
    // return bcrypt.compare(password, user.password)
    return (password == user.password)
  })
  .then((match) =>{
    if(!match){
      res.status(401).json({
        "error": true,
        "message": "Incorrect email or password"
      })
      console.log("Incorrect password")
      return;
    }
    //Create and return JWT 
    const secretKey = "someSuperSecretKeyInCamelCaseForSomeReason";
    const expires_in = 60 * 60 * 24;//86,400 seconds = 24 hours
    const exp = Date.now() + expires_in * 1000
    const token = jwt.sign({email, exp}, secretKey);
    res.json({token_type:"Bearer", token, expires_in})
  })
});

router.put("/:email/profile", function (req, res, next) {
  res.render("index", { title: "Login Endpoint" });
});

router.put("/:email/profile", function (req, res, next) {
  res.render("index", { title: "Login Endpoint" });
});

module.exports = router;
