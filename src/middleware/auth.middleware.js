const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  if (!req.headers.token) {
    return res.status(401).send({
      error: true,
      message: "Unauthorised Access"
    });
  } else {
    jwt.verify(req.headers.token, "kleverSecret", function(err, decoded) {
      if (err) {
        return res.status(401).send({
          error: true,
          message: "Unauthorised Access"
        });
      } else {
        req.userId = decoded._id;
        next();
      }
    });
  }
};

module.exports = authMiddleware;
