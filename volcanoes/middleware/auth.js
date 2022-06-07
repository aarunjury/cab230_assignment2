const jwt = require("jsonwebtoken");

module.exports.authorise = (req, res, next) => {
  const auth = req.headers.authorization;
  let token = null;

  if (auth === undefined){
      next();
      return;
  }
  // Retrieve token
  else {
    // Check if malformed
    if (auth.split(" ")[0] != "Bearer") {
      res
        .status(401)
        .json({ error: true, message: "Authorization header is malformed" });
    }
    // If not malformed, stored it
    if (auth.split(" ").length === 2) {
      token = auth.split(" ")[1];
    }
  }

  // Verify JWT and check expiration date
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    
    if (decoded.exp < Date.now()) {
      res.status(401).json({ error: true, message: "JWT token has expired" });
    }
    // add an isAuth property to the request object to be used later
    req.isAuth = true;
    next();
  } catch (e) {
    if (e.message === "jwt must be provided") {
      res.status(401).json({
        error: true,
        message: "Authorization header ('Bearer token') not found",
      });
    } else {
      res.status(401).json({ error: true, message: "Invalid JWT token" });
    }
  }
};

