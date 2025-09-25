const jwt = require("jsonwebtoken");
const jwtVerifier = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("You are not valid user");
    return res.status(400).json({ message: "You are not valid user" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
    if (err) {
      console.log("Your Token is Expired, Please Sign In again");
      return res
        .status(403)
        .json({ message: "Your Token is Expired, Please Sign In again" });
    }
    req.user = decoded.email;
    console.log("Successfully verified via JWT");
    next();
  });
};
module.exports = jwtVerifier;
