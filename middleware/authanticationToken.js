const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).send({ message: "No token provided." });
  }

  try {
    // Remove the 'Bearer ' prefix if it exists
    const tokenWithoutBearer = token.startsWith("Bearer ") ? token.slice(7) : token;

    // Verify the token and decode the user data
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request object
    next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid or expired token." });
  }
};

module.exports = authenticate;
