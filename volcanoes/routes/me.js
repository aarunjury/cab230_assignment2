const express = require("express");
const router = express.Router();

// Function to return my details
router.get("/", function (req, res, next) {
  res.json({
    name: "Aarun Jury",
    student_number: "n9691693"
  })
});

module.exports = router;
