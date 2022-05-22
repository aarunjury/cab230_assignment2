var express = require("express");
var router = express.Router();

router.get("/countries", function (req, res, next) {
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
        Message: "Error in MySQL query",
      });
    });
});

router.get("/volcanoes", function (req, res, next) {
  const countryName = req.query.country;
  let populatedWithin = req.query.populatedWithin;
  if (populatedWithin){
    populatedWithin = populatedWithin.replace("km","");
    query = `population_${populatedWithin}km`;
    console.log(populatedWithin);
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
      res.json({
        Error: true,
        Message: "Error in MySQL query",
      });
    });
  }
});

router.get("/volcano/:id", function (req, res, next) {
  const volcanoID = req.params.id;
  req.db.from("data").where("id", volcanoID)
  .then((row) => {
    res.json({
      id: row[0].id,
      name: row[0].name,
      country: row[0].country,
      region: row[0].region,
      subregion: row[0].subregion,
      last_eruption: row[0].last_eruption,
      summit: row[0].summit,
      elevation: row[0].elevation,
      latitude: row[0].latitude,
      longitude: row[0].longitude
    });
  })
  .catch((err) => {
    console.log(err);
    res.json({
      Error: true,
      Message: "Error in MySQL query",
    });
  });
});

router.get("/me", function (req, res, next) {
  res.json({
    "name": "Aarun Jury",
    "student_number": "n9691693"
  })
});

// router.get("/api/city/:CountryCode", function (req, res, next) {
//   const countryCode = req.params.CountryCode;
//   req.db
//     .from("data")
//     .select("*")
//     .where("CountryCode", "=", countryCode)
//     .then((rows) => {
//       res.json({
//         error: false,
//         message: "success",
//         data: rows,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.json({
//         error: true,
//         message: "Error in MySQL query",
//       });
//     });
// });

// router.get("/countries", function (req, res, next) {
//   req.db
//     .from("data")
//     .select("country")
//     .then((rows) => {
//       res.json({
//         Error: false,
//         Message: "success",
//         city: rows,
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.json({
//         Error: true,
//         Message: "Error in MySQL query",
//       });
//     });
// });

// router.post("/api/update", function (req, res, next) {
//   if (!req.body.City || !req.body.CountryCode || !req.body.Pop) {
//     res.status(400).json({ error: true, message: "Request malformed" });
//     return;
//   }
//   req.db
//     .from("city")
//     .update({ Population: req.body.Pop })
//     .where({ CountryCode: req.body.CountryCode, name: req.body.City })
//     .then(() =>
//       res.status(200).json({
//         error: false,
//         message: `Updated population of ${req.body.City} to ${req.body.Pop}`,
//       })
//     )
//     .catch((e) => {
//       console.log(e);
//       res.status(500).json({
//         error: true,
//         message: "Database error. Please try again.",
//       });
//     });
//   // res.send(JSON.stringify(req.body));
//   // console.log(req);
// });

module.exports = router;
