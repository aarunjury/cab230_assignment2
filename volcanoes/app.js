const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerDog = require("./docs/swaggerdog");
const bcrypt = require('bcrypt');
const options = require("./knexfile.js");
const knex = require("knex")(options);

require("dotenv").config();
// access env var for private key
process.env.TOKEN_SECRET;

const meRouter = require("./routes/me");
const countriesRouter = require("./routes/countries");
const userRouter = require("./routes/user");
const volcanoRouter = require("./routes/volcano");
const volcanoesRouter = require("./routes/volcanoes");

var app = express();

app.use((req, res, next) => {
  req.db = knex;
  next();
});
app.use(cors());
app.use("/", swaggerUI.serve);
app.get("/", swaggerUI.setup(swaggerDog, {swaggerOptions: {defaultModelsExpandDepth: -1},}))

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/me", meRouter);
app.use("/countries", countriesRouter);
app.use("/user", userRouter);
app.use("/volcano", volcanoRouter);
app.use("/volcanoes", volcanoesRouter);

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