const asyncHandler = require("express-async-handler"); // we dont need seperate try catch block, simply wrap the function with async handler
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.header.Authorization || req.header.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is not Authorized");
      }
      req.user = decoded.user;
      next();
    });
    if(!token){
        res.status(401);
        throw new Error("User is not Authorized or Missing header")
    }
  }
});

module.exports = validateToken;
