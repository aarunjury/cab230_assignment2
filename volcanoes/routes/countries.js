const express = require("express");
const router = express.Router();

router.get("/", function (req, res, next) {
    req.db
      .distinct()
      .from("data")
      .pluck("country")
      .orderBy("country")
      .then((rows) => {
        res.json(rows)
      })
      .catch((err) => {
        console.log(err);
        res.json({
          Error: true,
          Message: "Error in MySQL query"
        });
      });
  });

  module.exports = router;