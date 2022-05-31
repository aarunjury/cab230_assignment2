const express = require("express");
const router = express.Router();

// Function to return an array of volcanoes dependant on either country or
// country and populatedWithin arguments
router.get("/", function (req, res, next) {
    const countryName = req.query.country;
    let populatedWithin = req.query.populatedWithin;
    const allowedPop = [5,10,30,100];
  
    // Sense-checks
    if (!req.query.country){
      res.status(400).json({
        "error": true,
        "message": "Country is a required query parameter."
      })
      // console.log("Country not provided");
      return;
    }
    else if ((Object.keys(req.query).length) === 2 && !req.query.populatedWithin){
      res.status(400).json({
        "error": true,
        "message": "Invalid query parameters. Only country and populatedWithin are permitted."
      })
      // console.log("Too many parameters");
      return;
    }
  
    // If query includes a populatedWithin radius arg
    if (populatedWithin){
      populatedWithin = populatedWithin.replace("km","");
      query = `population_${populatedWithin}km`;
      // console.log(populatedWithin);
      //check the supplied argument is allowed
      if (!allowedPop.includes(parseInt(populatedWithin))){
        res.status(400).json({
          "error": true,
          "message": "Invalid value for populatedWithin. Only: 5km,10km,30km,100km are permitted."
        })
        return;
      }
      req.db
      .from("data")
      .where("country", "=", countryName)
      .andWhere(`${query}`, ">", 0)
      .select("id","name","country","region","subregion")
      .then((rows) => {
        res.json(rows);
      })
      .catch((err) => {
        console.log(err);
        res.json({
          Error: true,
          Message: "Error in MySQL query",
        });
      });
    }
    else{
      req.db
      .from("data")
      .where("country", "=", countryName)
      .select("id","name","country","region","subregion")
      .then((rows) => {
        res.json(rows)
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: true,
          message: "Error in MySQL query",
        });
      });
    }
  });

  module.exports = router;