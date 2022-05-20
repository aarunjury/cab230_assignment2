var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "The Volcanoes of the World API" });
});

// router.get("/countries", function (req, res, next) {
//   res.render("index", { title: "Countries Endpoint" });
// });

router.get("/volcanoes", function (req, res, next) {
  res.render("index", { title: "Volcanoes Endpoint" });
});

router.get("/volcano:id", function (req, res, next) {
  res.render("index", { title: "Volcano{id} Endpoint" });
});

router.get("/countries", function (req, res, next) {
  req.db
    .from("data")
    .select("country")
    .then((rows) => {
      res.json({
        Error: false,
        Message: "success",
        city: rows,
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

// router.get("/api/city/:CountryCode", function (req, res, next) {
//   const countryCode = req.params.CountryCode;
//   req.db
//     .from("city")
//     .select("*")
//     .where("CountryCode", "=", countryCode)
//     .then((rows) => {
//       res.json({
//         error: false,
//         message: "success",
//         city: rows,
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
