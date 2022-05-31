const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth")

// Function to get a volcano by ID and conditionally return either a full or
// restricted dataset
router.get("/:id", auth.authorise, function (req, res, next) {
    const volcanoID = req.params.id;
    let query = req.db.from("data")
    .select("id", "name", "country","region","subregion","last_eruption","summit","elevation","latitude","longitude")
    .where("id", volcanoID);
    // if the middleware 'auth.authorise' function has added isAuth=true to the request
    // object, user must be properly authenticated so go ahead and update the 
    // query to include the population data
    if (req.isAuth){
      query = req.db.from("data")
      .select("id", "name", "country","region","subregion","last_eruption","summit",
      "elevation","population_5km","population_10km","population_30km","population_100km","latitude","longitude")
      .where("id", volcanoID);
    }
  
    query
    .then(volcano => {
      if (volcano.length === 0){
        res.status(404).json({
          error: true,
          message: `Volcano with ID: ${volcanoID} not found.`
        });
        return;
      }
      res.json(volcano[0]);
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