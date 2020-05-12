const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
  // http://localhost:3001/api/?token=
  const token = req.header("token");
// console.log(token)
  if (!token) {
    return res
      .status(401)
      .json({ message: "Aha!! You are not allowed to view this!!!" });
  }

  try {
    const decoded = jwt.verify(token, 'SECRET');
    if(decoded.user){
      req.user = decoded.user;
    } else {
      req.user = decoded.company;
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Your token is invalid" });
  }
};