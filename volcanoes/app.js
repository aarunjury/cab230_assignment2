const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const options = require("./knexfile.js");
const knex = require("knex")(options);
const cors = require("cors");
require("dotenv").config();
const swaggerUI = require("swagger-ui-express");
const swaggerDog = require("./docs/swaggerdog.json");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/user");

var app = express();

app.use((req, res, next) => {
  req.db = knex;
  next();
});
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDog));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("combined"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.get("/knex", function (req, res, next) {
  req.db
    .raw("SELECT VERSION()")
    .then((version) => console.log(version[0][0]))
    .catch((err) => {
      console.log(err);
      throw err;
    });
  res.send("Version logged");
});

app.use("/", indexRouter);
app.use("/user", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
