const express = require("express");
const router = express.Router();
const dayjs = require('dayjs')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require("../middleware/auth")
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

// Function to register a new user
router.post("/register", function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  const getUser = req.db.from("users").select("*").where("email",email)
  // ********** need to check email is a valid(ish) email address with a regex/validator?? *************
  // Check both an email and password are provided
  if (!email || !password){
    res.status(400).json({
      error: true,
      message: "Request body incomplete, both email and password are required"
    })
    return;
  }

  // Check the provided email doesn't already exist in the database
  getUser.then((users) => {
    if (users.length > 0){
      res.status(409).json({
        error: true,
        message: "User already exists"
      })
      return;
    }
    // Email is unique so create the user, salt the password to store
    const salt = 10
    const hash = bcrypt.hashSync(password, salt)
    return req.db.from("users").insert({email, hash})
    .then(() =>{
      res.status(201).json({
        error: false,
        message: "User created"
      })
    })
  })

  .catch((err) => {
    console.log(err);
    res.status(500).json({
      error: true,
      message: "Error in MySQL query",
    });
  });
});//end register

// Function to login and receive a JWT
router.post("/login", function (req, res, next) {
  const { email, password } = req.body;
  const getUser = req.db.from("users").select("*").where({ email })

  // Verify body of POST request object by checking email and password are provided
  if (!email || !password){
    res.status(400).json({
      error: true,
      message: "Request body incomplete, both email and password are required"
    })
    return;
  }

  // check the provided email exists in the database
  getUser.then(users => {
    if (users.length === 0){
      res.status(401).json({
        error: true,
        message: "Incorrect email or password"
      });
      return;
    }

    // Params are valid(ish) and email exists in database so check the password
    const { hash } = users[0];
    return bcrypt.compare(password, hash)
    .then(match => {
      if (!match){
        res.status(401).json({
          error: true,
          message: "Incorrect email or password"
        });
        return;
      }
      //Everything else is good so create and return JWT 
      // console.log("Password match")
      const expires_in = 60 * 60 * 24;//86,400 seconds = 24 hours
      const exp = Date.now() + expires_in * 1000
      const token = jwt.sign({email, exp}, process.env.TOKEN_SECRET);
      res.json({ token, token_type:"Bearer", expires_in })
    })
  })
  .catch((e) => {
    console.log(e);
    res.status(500).json({
      error: true,
      message: "Database error. Please try again.",
    });
  });
});//end login

// Function to retrieve a registered user's profile
router.get("/:email/profile", auth.authorise, function (req, res, next) {
  const email = req.params.email;
  let query = req.db.from("users").select("email", "firstName","lastName").where("email",email);

  // If the auth.authorise function has inserted isAuth into the request object
  // get the token from the header
  if (req.isAuth){
    const auth = req.headers.authorization;
    const token = auth.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    // if the email address in the token is the same as in the URL
    // execute the query to retrieve the profile
    if (decodedToken.email === email){
      query = req.db.from("users").select("email", "firstName","lastName","dob","address").where("email",email);
    }
  }

  query
    .then((user) => {
      if (user.length === 0){
        res.status(404).json({
          error: true,
          message: "User not found"
        })
      return;
    }
    res.json(user[0]);
  })
  .catch((e) => {
    res.json({
      error: true,
      message: "Error in MySQL Query"
    })
  })
});//end get profile

// Function to update a registered user's profile
router.put("/:email/profile", auth.authorise, function (req, res, next) {
  const email = req.params.email;
  const checkUser = req.db.from("users").select("*").where("email",email);
  const { firstName, lastName, dob, address } = req.body

  // Only authorised users can proceed
  if (!req.isAuth){
    res.status(401).json({
      error: true,
      message: "Authorization header ('Bearer token') not found",
    })
  }

  // Verify body
  if (!firstName || !lastName || !dob || !address) {
    res.status(400).json({
      error: true,
      message:
        "Request body incomplete: firstName, lastName, dob and address are required.",
    });
    return;
  }
  
  // Check parameters are of correct type
  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof address !== "string"
  ) {
    res.status(400).json({
      error: true,
      message:
        "Request body invalid: firstName, lastName and address must be strings only.",
    });
    return;
  }

  // check user is in database
  if (checkUser.length === 0){
    res.status(404).json({
      error: true,
      message: "User not found"
    })
  }

  let now = dayjs();
  let parsedDob = dayjs(dob);

  // Check format of dob
  if (!dayjs(dob, "YYYY-MM-DD", true).isValid()) {
    res.status(400).json({
      error: true,
      message: "Invalid input: dob must be a real date in format YYYY-MM-DD.",
    });
    return;
  }
  // Check if dob is out of bounds
  if (parsedDob.isAfter(now)) {
    res.status(400).json({
      error: true,
      message: "Invalid input: dob must be a date in the past.",
    });
    return;
  }

  const auth = req.headers.authorization;
  const token = auth.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  // if the email address in the token is not the same as in the URL
  // stop the user from proceeding, otherwise perform the update query
  if (decodedToken.email !== email) {
    // console.log("Decoded email: "+decoded.email+"Email: "+email)
    res.status(403).json({
      error: true,
      message: "Forbidden",
    });
    return;
  }

  req.db
  .from("users")
  .update({firstName: firstName, lastName: lastName, dob: dob, address: address})
  .where("email",email)
  .then(() => {
    res.json({
      "email": email,
      "firstName": firstName,
      "lastName": lastName,
      "dob": dob,
      "address": address
    })
  })
  .catch((err) => {
    console.log(err);
    res.json({
      Error: true,
      Message: "Error in MySQL query",
    });
  });
});

module.exports = router;
