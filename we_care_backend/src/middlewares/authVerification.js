const { DecodeToken } = require("../utility/tokenHelper");

module.exports = () => {
  return (req, res, next) => {
    if (req.method === "OPTIONS") return next();

    let token = req.headers.authorization;
    if (token && token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = DecodeToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    req.user = {
      _id: decoded._id,
      email: decoded.email,
    };

    next();
  };
};