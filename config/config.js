const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
  // http://localhost:3001/api/?token=
  const token = req.header("token");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Aha!! You are not allowed to view this!!!" });
  }

  try {
    const decoded = jwt.verify(token, 'SECRET');

    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Your token is invalid" });
  }
};